import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRouter from "./routers/user-router";
import { config } from "dotenv";
import errorMiddleware from "./middlewares/error-middleware";
import codeRouter from "./routers/code.router";
import postRouter from "./routers/post-router";
import reactionRouter from "./routers/reaction-router";
import commentRouter from "./routers/comment-router";
import subscribersPageOwnersRouter from "./routers/subscribersPageOwners-router";
import friendshipRouter from "./routers/friendship-router";
import messageRouter from "./routers/message-router";
import { schedule } from "node-cron";
import tokensService from "./services/tokens-service";
import profileImageRouter from "./routers/profileImage-router";
import postImageRouter from "./routers/postImage-router";
import { createServer } from "http";
import { Server } from "socket.io";
import chatRouter from "./routers/chat-router";

config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://192.168.3.68:3000",
            "http://192.168.11.176:3000",
            "http://192.168.136.176:3000",
        ],
        credentials: true,
    },
});

let messageSubscribers: {
    [chatId: number]: { socketId: string; subscriberId: number }[];
} = {};

let imageSubscribers: {
    [userId: number]: string[];
} = {};

let postSubscribers: {
    [userId: number]: string[];
} = {};

let likeSubscribers: {
    [postId: number]: { socketId: string; authorId: number }[];
} = {};
let onlineSubscribers: { [userId: number]: string[] } = {};

let chatReadSubscribers: {
    [chatId: number]: string;
} = {};

let messageReadSubscribers: {
    [messageId: number]: string;
} = {};

const removeFromMessages = (socketId: string) => {
    for (let chatId in messageSubscribers) {
        messageSubscribers[chatId] = messageSubscribers[chatId].filter(
            (subscriber) => subscriber.socketId !== socketId
        );
        if (messageSubscribers[chatId].length === 0) {
            delete messageSubscribers[chatId];
        }
    }
};

const removeFromImage = (socketId: string) => {
    for (let userId in imageSubscribers) {
        imageSubscribers[userId] = imageSubscribers[userId].filter(
            (socketIdData) => socketIdData !== socketId
        );
        if (imageSubscribers[userId].length === 0) {
            delete imageSubscribers[userId];
        }
    }
};

const removeFromPost = (socketId: string) => {
    for (let userId in postSubscribers) {
        postSubscribers[userId] = postSubscribers[userId].filter(
            (socketIdData) => socketIdData !== socketId
        );
        if (postSubscribers[userId].length === 0) {
            delete postSubscribers[userId];
        }
    }
};

const removeFromLike = (socketId: string) => {
    for (let postId in likeSubscribers) {
        likeSubscribers[postId] = likeSubscribers[postId].filter(
            (socketIdData) => socketIdData.socketId !== socketId
        );
        if (likeSubscribers[postId].length === 0) {
            delete likeSubscribers[postId];
        }
    }
};

const removeFromOnline = (socketId: string) => {
    for (let userId in onlineSubscribers) {
        onlineSubscribers[userId] = onlineSubscribers[userId].filter(
            (socketIdData) => socketIdData !== socketId
        );
        if (onlineSubscribers[userId].length === 0) {
            delete onlineSubscribers[userId];
        }
    }
};

const removeFromChatRead = (socketId: string) => {
    for (let chatId in chatReadSubscribers) {
        if (chatReadSubscribers[chatId] === socketId) {
            delete chatReadSubscribers[chatId];
            return;
        }
    }
};

const removeFromMessageRead = (socketId: string) => {
    for (let messageId in messageReadSubscribers) {
        if (messageReadSubscribers[messageId] === socketId) {
            delete messageReadSubscribers[messageId];
            return;
        }
    }
};

io.on("connection", (socket) => {
    socket.on("subscribe_message_read", ({ messageId }) => {
        if (messageReadSubscribers[messageId]) return;
        messageReadSubscribers[messageId] = socket.id;
    });

    socket.on("reading_message", ({ messageId }) => {
        if (!messageReadSubscribers[messageId]) return;
        io.to(messageReadSubscribers[messageId]).emit("read_message");
    });

    socket.on("subscribe_chat_read", ({ chatId }) => {
        if (chatReadSubscribers[chatId]) return;
        chatReadSubscribers[chatId] = socket.id;
    });

    socket.on("add_unread_message_count", ({ chatId }) => {
        if (!chatReadSubscribers[chatId]) return;
        io.to(chatReadSubscribers[chatId]).emit("set_undread_message_count");
    });

    socket.on("subscribe_online", ({ userId }) => {
        if (!onlineSubscribers[userId]) onlineSubscribers[userId] = [];
        const existingSubscriber = onlineSubscribers[userId].find(
            (el) => el === socket.id
        );
        if (!existingSubscriber) onlineSubscribers[userId].push(socket.id);
    });

    socket.on("is_online", ({ userId }) => {
        if (!onlineSubscribers[userId]) return;
        for (let i = 0; i < onlineSubscribers[userId].length; i++) {
            io.to(onlineSubscribers[userId][i]).emit("set_status", {
                isOnline: true,
            });
        }
    });

    socket.on("is_offline", ({ userId }) => {
        if (!onlineSubscribers[userId]) return;
        for (let i = 0; i < onlineSubscribers[userId].length; i++) {
            io.to(onlineSubscribers[userId][i]).emit("set_status", {
                isOnline: false,
            });
        }
    });

    socket.on("subscribe_like", ({ postId, authorId }) => {
        if (!likeSubscribers[postId]) likeSubscribers[postId] = [];
        const existingSubscriber = likeSubscribers[postId].find(
            (el) => el.socketId === socket.id
        );
        if (!existingSubscriber)
            likeSubscribers[postId].push({ socketId: socket.id, authorId });
    });

    socket.on("change_like", ({ postId, operation, authorId }) => {
        if (!likeSubscribers[postId]) return;
        for (let i = 0; i < likeSubscribers[postId].length; i++) {
            if (likeSubscribers[postId][i].authorId !== authorId) {
                io.to(likeSubscribers[postId][i].socketId).emit("set_like", {
                    operation,
                });
            }
        }
    });

    socket.on("subscribe_post", ({ userId }) => {
        if (!postSubscribers[userId]) postSubscribers[userId] = [];
        const existingSubscriber = postSubscribers[userId].find(
            (socketId) => socketId === socket.id
        );
        if (!existingSubscriber) postSubscribers[userId].push(socket.id);
    });

    socket.on("new_post", ({ post }) => {
        if (!postSubscribers[post.postAuthorId]) return;
        for (let i = 0; i < postSubscribers[post.postAuthorId].length; i++) {
            io.to(postSubscribers[post.postAuthorId][i]).emit("add_post", {
                post,
            });
        }
    });

    socket.on("delete_post", ({ postId, authorId }) => {
        if (!postSubscribers[authorId]) return;
        for (let i = 0; i < postSubscribers[authorId].length; i++) {
            io.to(postSubscribers[authorId][i]).emit("filter_posts", {
                postId,
            });
        }
    });

    socket.on("subscribe_image", ({ userId }) => {
        if (!imageSubscribers[userId]) imageSubscribers[userId] = [];
        const existingSubscriber = imageSubscribers[userId].find(
            (socketId) => socketId === socket.id
        );
        if (!existingSubscriber) imageSubscribers[userId].push(socket.id);
    });

    socket.on("change_image", ({ userId }) => {
        if (!imageSubscribers[userId]) return;
        for (let i = 0; i < imageSubscribers[userId].length; i++) {
            io.to(imageSubscribers[userId][i]).emit("set_image");
        }
    });

    socket.on("subscribe_messages", ({ chatId, userId }) => {
        if (!messageSubscribers[chatId]) messageSubscribers[chatId] = [];
        const existingSubscriber = messageSubscribers[chatId].find(
            (subscriber) => subscriber.socketId === socket.id
        );
        if (!existingSubscriber)
            messageSubscribers[chatId].push({
                socketId: socket.id,
                subscriberId: userId,
            });
    });

    socket.on("new_message", ({ chatId, userId, message }) => {
        if (!messageSubscribers[chatId]) return;
        for (let i = 0; i < messageSubscribers[chatId].length; i++) {
            if (messageSubscribers[chatId][i].subscriberId !== userId) {
                io.to(messageSubscribers[chatId][i].socketId).emit(
                    "add_message",
                    { message }
                );
            }
        }
    });

    socket.on("delete_message", ({ chatId, messageId, userId }) => {
        if (!messageSubscribers[chatId]) return;
        for (let i = 0; i < messageSubscribers[chatId].length; i++) {
            if (messageSubscribers[chatId][i].subscriberId !== userId) {
                io.to(messageSubscribers[chatId][i].socketId).emit(
                    "filter_messages",
                    { messageId }
                );
            }
        }
    });

    socket.on("disconnect", () => {
        removeFromMessages(socket.id);
        removeFromImage(socket.id);
        removeFromPost(socket.id);
        removeFromLike(socket.id);
        removeFromOnline(socket.id);
        removeFromChatRead(socket.id);
        removeFromMessageRead(socket.id);
    });
});

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "http://192.168.3.68:3000",
            "http://192.168.11.176:3000",
            "http://192.168.136.176:3000",
        ],
    })
);
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/code", codeRouter);
app.use("/api/post", postRouter);
app.use("/api/reaction", reactionRouter);
app.use("/api/comment", commentRouter);
app.use("/api/subscribersPageOwners", subscribersPageOwnersRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/message", messageRouter);
app.use("/api/profileImage", profileImageRouter);
app.use("/api/postImage", postImageRouter);
app.use("/api/chat", chatRouter);

app.use(errorMiddleware);

const PORT = Number(process.env.SERVER_PORT) || 8080;

const start = async () => {
    try {
        schedule("* * * * *", async () => await tokensService.sheduleToken());
        server.listen(PORT, "0.0.0.0", () =>
            console.log(`[server] started on PORT = ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();

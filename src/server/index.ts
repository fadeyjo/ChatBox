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
import postService from "./services/post-service";

config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    },
});

let profileSubscribers: {
    [userId: number]: { subscriberId: number; socketId: string }[];
} = {};

let postSubscribers: {
    [postId: number]: { subscriberId: number; socketId: string }[];
} = {};

const removeFromProfile = (socketId: string) => {
    for (const userId in profileSubscribers) {
        for (let i = 0; i < profileSubscribers[userId].length; i++) {
            if (profileSubscribers[userId][i].socketId === socketId) {
                profileSubscribers[userId].splice(i, 1);
                return;
            }
        }
    }
};

const removeFromPost = (socketId: string) => {
    for (const postId in postSubscribers) {
        for (let i = 0; i < postSubscribers[postId].length; i++) {
            if (postSubscribers[postId][i].socketId === socketId) {
                postSubscribers[postId].splice(i, 1);
                return;
            }
        }
    }
};

io.on("connection", (socket) => {
    socket.on("subscribe_post", ({ postId, subscriberId }) => {
        if (!postSubscribers[postId]) {
            postSubscribers[postId] = [];
        }
        postSubscribers[postId].push({
            socketId: socket.id,
            subscriberId: subscriberId,
        });
    });

    socket.on("subscribe_profile", ({ userId, subscriberId }) => {
        if (!profileSubscribers[userId]) {
            profileSubscribers[userId] = [];
        }
        profileSubscribers[userId].push({
            socketId: socket.id,
            subscriberId: subscriberId,
        });
    });

    socket.on("change_profile_image", ({ userId }) => {
        if (!profileSubscribers[userId]) return;
        for (let i = 0; i < profileSubscribers[userId].length; i++) {
            io.to(profileSubscribers[userId][i].socketId).emit(
                "receive_profile_image"
            );
        }
        postService.getPostIdsByAuthorId(userId).then((ids) => {
            for (let i = 0; i < ids.length; i++) {
                if (!postSubscribers[ids[i]]) continue;
                for (let j = 0; j < postSubscribers[ids[i]].length; j++) {
                    io.to(postSubscribers[ids[i]][j].socketId).emit(
                        "receive_profile_image"
                    );
                }
            }
        });
    });

    socket.on("change_relationship", ({ userId }) => {
        if (!profileSubscribers[userId]) return;
        for (let i = 0; i < profileSubscribers[userId].length; i++) {
            io.to(profileSubscribers[userId][i].socketId).emit(
                "receive_relationship"
            );
        }
    });

    socket.on("change_self_relationship", ({ userId, selfUserId }) => {
        if (!profileSubscribers[selfUserId]) return;
        for (let i = 0; i < profileSubscribers[selfUserId].length; i++) {
            if (profileSubscribers[selfUserId][i].subscriberId === userId) {
                io.to(profileSubscribers[selfUserId][i].socketId).emit(
                    "receive_self_relationship"
                );
                return;
            }
        }
    });

    socket.on("disconnect", () => {
        removeFromProfile(socket.id);
        removeFromPost(socket.id);
    });
});

app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL || "http://localhost:3000",
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

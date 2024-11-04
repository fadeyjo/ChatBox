import IReactionFromDatabase from "../interfaces/IReactionFromDatabase";

export default class ReactionDto {
    reactionId: number;
    postId: number;
    reactionAuthorId: number;

    constructor(reaction: IReactionFromDatabase) {
        this.reactionId = reaction.reaction_id;
        this.postId = reaction.post_id;
        this.reactionAuthorId = reaction.reaction_author_id;
    }
}

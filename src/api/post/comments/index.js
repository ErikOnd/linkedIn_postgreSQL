import express from "express";
import createHttpError from "http-errors";
import CommentModel from "./model.js";
import UserModel from "../../user/model.js";

const commentRouter = express.Router();

commentRouter.post("/:post_id/comments", async (req, res, next) => {
  try {
    req.body.post_id = req.params.post_id;
    const { comment_id } = await CommentModel.create(req.body);
    res.status(201).send({ comment_id });
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/:post_id/comments", async (req, res, next) => {
  try {
    const comments = await CommentModel.findAll({
      where: { post_id: req.params.post_id },
      include: [
        { model: UserModel, attributes: ["name", "surename", "image"] },
      ],
    });
    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/:post_id/comments/:comment_id", async (req, res, next) => {
  try {
    const comment = await CommentModel.findByPk(req.params.comment_id, {
      include: [
        { model: UserModel, attributes: ["name", "surename", "image"] },
      ],
    });
    if (comment) {
      res.send(comment);
    } else {
      next(
        createHttpError(
          404,
          `Comment with the id ${req.params.comment_id} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.put("/:post_id/comments/:comment_id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await CommentModel.update(
      req.body,
      {
        where: { comment_id: req.params.comment_id },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Comment with id ${req.params.comment_id} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

commentRouter.delete(
  "/:post_id/comments/:comment_id",
  async (req, res, next) => {
    try {
      const numberOfDeletedRows = await CommentModel.destroy({
        where: { comment_id: req.params.comment_id },
      });
      if (numberOfDeletedRows === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.comment_id} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default commentRouter;

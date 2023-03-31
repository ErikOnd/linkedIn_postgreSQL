import express from "express";
import createHttpError from "http-errors";
import UserModel from "../user/model.js";
import CommentModel from "./comments/model.js";
import PostModel from "./model.js";

const postRouter = express.Router();

postRouter.post("/", async (req, res, next) => {
  try {
    const { post_id } = await PostModel.create(req.body);
    res.status(201).send({ post_id });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.findAll({
      include: [
        { model: UserModel, attributes: ["name", "surename", "image"] },
      ],
    });
    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:post_id", async (req, res, next) => {
  try {
    const post = await PostModel.findByPk(req.params.post_id, {
      include: [
        { model: UserModel, attributes: ["name", "surename", "image"] },
      ],
    });
    if (post) {
      res.send(post);
    } else {
      next(
        createHttpError(404, `Post with the id ${req.params.post_id} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:post_id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await PostModel.update(
      req.body,
      {
        where: { post_id: req.params.post_id },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.post_id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:post_id", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await PostModel.destroy({
      where: { post_id: req.params.post_id },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.post_id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;

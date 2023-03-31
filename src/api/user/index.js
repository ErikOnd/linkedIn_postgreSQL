import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const { user_id } = await UsersModel.create(req.body);
    res.status(201).send({ user_id });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(
      req.body,
      { where: { user_id: req.params.userId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({
      where: { user_id: req.params.userId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedIn/userImg",
    },
  }),
}).single("userImg");

userRouter.put("/:userId/image", cloudinaryUploader, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.update(
      { image: req.file.path },
      { where: { user_id: req.params.userId }, returning: true }
    );

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send("User with that id doesn't exist");
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;

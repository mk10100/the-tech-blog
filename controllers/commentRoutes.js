const express = require("express");
const router = express.Router();
const { Comment } = require("../models"); // Assuming you have a Comment model

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({ where: { postId } });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/:postId/:id", async (req, res) => {
//   const { postId, id } = req.params;
//   try {
//     const comment = await Comment.findOne({ where: { postId, id } });
//     if (comment) {
//       res.json(comment);
//     } else {
//       res.status(404).json({ error: "Comment not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.post("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = `${req.session.userId}`;

  try {
    await Comment.create({ postId, content, userId });
    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/:postId/:id", async (req, res) => {
//   const { postId, id } = req.params;
//   const { content } = req.body;
//   try {
//     const comment = await Comment.findOne({ where: { postId, id } });
//     if (comment) {
//       comment.content = content;
//       await comment.save();
//       res.json(comment);
//     } else {
//       res.status(404).json({ error: "Comment not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.delete("/:postId/:id", async (req, res) => {
  const { postId, id } = req.params;
  try {
    const comment = await Comment.findOne({ where: { postId, id } });
    if (comment) {
      await comment.destroy();
      res.json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assuming you want to delete all comments associated with a specific postId
router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    // Find and delete all comments for the given postId
    const result = await Comment.destroy({ where: { postId } });

    if (result > 0) {
      res.json({ message: "All comments deleted successfully" });
    } else {
      res.status(404).json({ error: "No comments found for the given postId" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

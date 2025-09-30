import { Router } from "express";
const router = Router();


router.get("/info", (req, res) => {
  const info = {
    title: "Organization Info",
    images: [
      { src: "/images/image1.jpg", alt: "Image 1" },
      { src: "/images/image2.jpg", alt: "Image 2" },
    ],
    posts: [
      { title: "Post 1", content: "This is the content of post 1" },
      { title: "Post 2", content: "This is the content of post 2" },
    ],
    headlines: [
      { title: "Headline 1", content: "This is the content of headline 1" },
      { title: "Headline 2", content: "This is the content of headline 2" },
    ],
  };
  res.render("info", { info });
});

export default router;
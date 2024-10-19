import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { createInfor, getInfor } from "./model";
import { upload, uploadFile } from "./middlewares/multer";
import path from "path";
import fs from "fs";

const app = new Elysia();
app.use(cors());
app.use(
  swagger({
    documentation: {
      info: {
        title: "MyProfile API Documentation",
        version: "0.0.1",
        description:
          "API นี้เป็นการสร้างโปรไฟล์เพื่อทำเป็น Resume website. หน้านี้จะเป็นคู่มือที่บอกทั้งหมดว่า API เรามีอะไรบ้างและรับส่งข้อมูลยังไงรวมไปถึง Error ต่างๆ ที่เราพบเจอ",
      },
    },
    path: "/",
  })
);

app.group("/profile", (app) =>
  app
    .get("/view", async () => getInfor())
    .post(
      "/create",
      async ({ body, set }) => {
        const data: any = body;

        const response: any = await createInfor({
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          email: data.email,
        });

        if (!response) {
          set.status = 500;
          return {
            code: 500,
            message: "Server Error: No response from createInfor",
          };
        }

        if (response.status === "Error") {
          set.status = 400;
          return { code: 400, message: "insert incomplete", error: response };
        }

        set.status = 201;
        return { message: "Profile created successfully", data: response };
      },
      {
        body: t.Object({
          firstname: t.String(),
          lastname: t.String(),
          phone: t.String(),
          email: t.String(),
        }),
      }
    )
    .post("/upload", async ({ set, body: { image, title } }) => {
      console.log("Title:", title);
      console.log("image", image);

      console.log(Array.isArray(image))

      // ตรวจสอบว่ามีการส่ง image มาหรือไม่
      if (!image || (Array.isArray(image) && image.length === 0)) {
        set.status = 400; // ส่งสถานะ 400 หากไม่มีภาพ
        return { message: "No images uploaded." };
      }

    const uploadedFiles = [];

    // ตรวจสอบว่า image เป็นอาเรย์หรือไม่
    const files = Array.isArray(image) ? image : [image]; // หากไม่เป็นอาเรย์ให้แปลงเป็นอาเรย์

    // ตรวจสอบขนาดไฟล์
    if (files.length === 0 || files[0]?.size === 0) {
      set.status = 400; // ส่งสถานะ 400 หากไฟล์ไม่ถูกต้อง
      return { message: "No valid images uploaded." };
  }

    for (const file of files) {
        const uploadPath = path.join(__dirname, "../uploads", file.name);

        try {
            const buffer = await file.arrayBuffer();
            const bufferData = Buffer.from(buffer);

            await fs.promises.writeFile(uploadPath, bufferData); // ใช้ promises สำหรับการอัปโหลดแบบ async/await

            uploadedFiles.push({ filename: file.name, path: uploadPath });
            console.log(`File uploaded: ${uploadPath}`);
        } catch (err) {
            console.error(`Error writing file: ${err}`);
            set.status = 500;
            return { message: `Error writing file: ${err}` };
        }
    }

      return { message: "Image uploaded successfully", title }; // ส่งข้อความตอบกลับ
    },{
      body: t.Object({
          title: t.String(),
          image: t.Files()
      })
  })
);

app.all("*", ({ set }) => {
  set.status = 404;
  return {
    result: "ไม่พบข้อมูลเส้นทาง",
    status: 404,
  };
});

app.listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

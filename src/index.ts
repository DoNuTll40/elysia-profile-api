import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { createInfor, getInfor } from "./model";

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
  })
);

app.group('/profile', (app) => 
  app
    .get('/view', async () => getInfor())
    .post('/create', async ({ body, set }) => {
      const data: any = body;

      const response: any = await createInfor({ 
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        email: data.email
      });

      if (!response) {
        set.status = 500;
        return { code: 500, message: 'Server Error: No response from createInfor' };
      }

      if (response.status === "Error") {
        set.status = 400;
        return { code: 400, message: 'insert incomplete', error: response };
      }

      set.status = 201;
        return { message: 'Profile created successfully', data: response };

    }, {
      body: t.Object({
        firstname: t.String(),
        lastname: t.String(),
        phone: t.String(),
        email: t.String(),
      })
    })
)

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

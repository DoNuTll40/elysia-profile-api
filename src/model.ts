import prisma from "./config/prisma";

export const getInfor = async () => {
  try {
    const rs = await prisma.information.findMany({
      include: {
        phones: true,
        emails: true,
      },
    });

    const filterPhoneEmail = rs.map((info) => {

        const filteredPhones = info.phones.filter(
          (phone) => phone.status === 1
        );

        const filteredEmails = info.emails.filter(
          (email) => email.status === 1
        );

        return {
          ...info,
          phones: filteredPhones,
          emails: filteredEmails,
        };
      })

      .filter((info) => info.phones.length > 0 || info.emails.length > 0);

    return filterPhoneEmail;
  } catch (err) {
    console.log("error", err);
    return [];
  }
};

export const createInfor = async (data: any) => {
  try {

    if (!data.firstname || !data.lastname || !data.phone || !data.email) {
      throw new Error("Validation Fail: Missing required fields");
    }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(data.phone)) {
      throw new Error("Validation Fail: Invalid phone format");
    }

    if (!emailRegex.test(data.email)) {
      throw new Error("Validation Fail: Invalid email format");
    }

    const rs = await prisma.information.create({
      data: {
        firstName: data.firstname,
        lastName: data.lastname,
        phones: {
          create: [{ phoneNumber: data.phone }],
        },
        emails: {
          create: [{ emailAddress: data.email }],
        },
      },
    });

    const getInfor = await prisma.information.findFirst({
      where: {
        id: rs.id,
      },
      include: {
        phones: true,
        emails: true,
      },
    });

    return getInfor;
  } catch (err: any) {
    return {
      status: "Error",
      message: err.message || "An unexpected error occurred",
    };
  }
};

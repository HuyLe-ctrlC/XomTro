import * as ROUTES from "../routes/routes";
export const navigationPrivate = [
  {
    name: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    name: "Create",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    name: "Bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    name: "Hồ sơ",
    href: ROUTES.USERS,
    current: false,
  },
];

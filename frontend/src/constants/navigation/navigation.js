import * as ROUTES from "../routes/routes";
export const navigationPrivate = [
  { title: "Home", href: ROUTES.HOME, current: true },
  { title: "Đăng tin", href: ROUTES.CREATE_POST, current: false },
  { title: "Quản lý Xomtro", href: ROUTES.XOMTRO, current: false },
  {
    title: "Bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
];

export const navigationAdmin = [
  {
    title: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    title: "Quản lý bài viết",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    title: "Bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    title: "Quản trị Xomtro",
    href: ROUTES.XOMTRO,
    current: false,
  },
  {
    title: "Quản lý tài khoản",
    href: ROUTES.USERS_MANAGEMENT,
    current: false,
  },
  {
    title: "Thể loại",
    href: ROUTES.CATEGORY_LIST,
    current: false,
  },
];

export const navigationPublic = [
  {
    title: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    title: "Đăng tin",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    title: "Các bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    title: "Đăng ký",
    href: ROUTES.REGISTER,
    current: false,
  },
  {
    title: "Đăng nhập",
    href: ROUTES.LOGIN,
    current: false,
  },
];

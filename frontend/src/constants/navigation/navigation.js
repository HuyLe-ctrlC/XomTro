import * as ROUTES from "../routes/routes";
export const navigationPrivate = [
  {
    name: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    name: "Đăng tin",
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

export const navigationAdmin = [
  {
    name: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    name: "Quản lý bài viết",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    name: "Bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    name: "Tác giả",
    href: ROUTES.USERS,
    current: false,
  },
  {
    name: "Quản lý tài khoản",
    href: ROUTES.USERS_MANAGEMENT,
    current: false,
  },
  {
    name: "Thể loại",
    href: ROUTES.CATEGORY_LIST,
    current: false,
  },
];

export const navigationPublic = [
  {
    name: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    name: "Đăng tin",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    name: "Các bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    name: "Đăng ký",
    href: ROUTES.REGISTER,
    current: false,
  },
  {
    name: "Đăng nhập",
    href: ROUTES.LOGIN,
    current: false,
  },
];
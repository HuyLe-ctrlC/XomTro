import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllAction,
  selectPosts,
  likePostAction,
  disLikePostAction,
} from "../../../../redux/slices/posts/postsSlices";
import { selectUser } from "../../../../redux/slices/users/usersSlice";
import DateFormatter from "../../../../utils/DateFormatter";
import {
  getAllAction as getCategories,
  selectCategory,
} from "../../../../redux/slices/category/categorySlice";
import LoadingComponent from "../../../../components/Loading/Loading";
import { BsCardImage, BsEye } from "react-icons/bs";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Paging } from "../../../../components/Paging/Paging";
import Skeleton from "../../../../utils/Skeleton";
import LabelXomTro from "../../../../components/LabelXomTro";
import Error from "../../../../components/Error";

export default function PostsList() {
  const title = "Các tin đăng";
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(6);
  const [keyword, setKeyword] = useState("");
  const [publish, setPublished] = useState(true);
  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
    publish: publish,
  };

  //select post from store
  const posts = useSelector(selectPosts);
  const user = useSelector(selectUser);
  const { data, loading, totalPage, appError, serverError, likes, dislikes } =
    posts;
  // console.log(data);
  //select categories from store
  const category = useSelector(selectCategory);
  const {
    data: dataCategory,
    loading: catLoading,
    appError: catAppErr,
    serverError: catServerErr,
  } = category;
  //dispatch
  const dispatch = useDispatch();
  //fetch post

  const getData = (newParams) => {
    document.title = title;
    dispatch(getAllAction(newParams));
  };

  useEffect(() => {
    getData(params);
    handleGetAllCate();
  }, []);

  // useEffect(() => {
  //   dispatch(getAllAction(params));
  // }, [dispatch, likes, dislikes]);
  //fetch categories
  useEffect(() => {}, [dispatch]);

  const handleGetAllCate = () => {
    // bookmark
    dispatch(getCategories({ ...params, keyword: "" }));
  };
  const handleTop100 = () => {
    const newParams = { ...params, limit: 100 };
    getData(newParams);
  };

  const handleClickCategories = (title) => {
    const newParams = { ...params, keyword: title };
    getData(newParams);
  };
  // ==== paging ==== //
  // prev page events
  const handlePrevClick = () => {
    if (currentPage > 1) {
      let prevPage = currentPage - 1;
      params.offset = (prevPage - 1) * limit;
      setCurrentPage(prevPage);
      getData();
    }
  };
  // next page events
  const handleNextClick = () => {
    if (currentPage < totalPage) {
      let nextPage = currentPage + 1;
      params.offset = (nextPage - 1) * limit;
      setCurrentPage(nextPage);
      getData(params);
    }
  };
  // change page event
  const handleChangePage = (page) => {
    params.offset = (page - 1) * limit;
    setCurrentPage(page);
    getData(params);
  };
  return (
    <>
      <section>
        <div className="pb-20 pt-10 bg-blue-50 min-h-screen radius-for-skewed">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-16 flex flex-row mr-3">
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute left-0 w-1 bg-green-400 h-20"></div>
                <div className="flex-none flex-shrink-0 ml-2">
                  <h2 className="font-sans font-semibold text-3xl lg:text-5xl font-heading">
                    Bài viết mới nhất
                  </h2>
                  <span className=" font-sans text-sm italic">
                    Các nhà trọ tốt nhất do XomTro tuyển chọn
                  </span>
                </div>
              </div>
              <div className=" block text-left md:text-right w-1/2 mt-4 md:mt-0">
                {/* View All */}
                <button
                  onClick={() => handleTop100()}
                  className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose transition duration-200"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
                <div className="w-full">
                  <LabelXomTro
                    label="Tìm phòng theo loại"
                    fontSize="2xl"
                    rFontSize="3xl"
                    heightOfLine="h-10"
                  />
                </div>
                <div className="py-4 px-6 bg-gradient-to-r from-green-300 to-blue-300 shadow-md rounded border-2">
                  {/* <h4 className="mb-4 text-base font-semibold uppercase">
                    Loại nhà
                  </h4> */}

                  <ul className="space-y-4">
                    {catLoading ? (
                      <LoadingComponent />
                    ) : catAppErr || catServerErr ? (
                      <h1>
                        {/* {catServerErr} {catAppErr} */}
                        Máy chủ đang bận
                      </h1>
                    ) : dataCategory?.length <= 0 ? (
                      <h1 className="text-lg text-center">
                        Không tìm thấy thể loại
                      </h1>
                    ) : (
                      dataCategory?.map((category) => (
                        <li key={category._id}>
                          <p
                            onClick={() =>
                              handleClickCategories(category.title)
                            }
                            className="block cursor-pointer py-2 px-3 rounded font-semibold bg-white group hover:bg-gray-100"
                          >
                            {category?.title}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full lg:w-3/4 px-3">
                {/* Post goes here */}
                {loading ? (
                  <Skeleton />
                ) : appError || serverError ? (
                  <h1 className=" text-center text-lg ">
                    {/* {serverError} {appError} */}
                    {serverError ==
                    "Cannot read properties of null (reading 'token')" ? (
                      "Vui lòng đăng nhập để thực hiện chức năng này!"
                    ) : (
                      <Error />
                    )}
                  </h1>
                ) : data === undefined || data?.length <= 0 ? (
                  <h1 className=" text-lg text-center">
                    Không tìm thấy bài viết
                  </h1>
                ) : (
                  data?.map((post) => (
                    <div
                      key={post._id}
                      className="flex flex-wrap bg-white -mx-3 mb-6 lg:mb-6 rounded-lg"
                    >
                      <div className="flex flex-col items-center w-full bg-white border border-gray-200 rounded-lg shadow md:flex-row md:w-full md:h-64 hover:bg-gray-100 ">
                        <img
                          className="object-cover w-full  flex-shrink-0 rounded-t-lg h-96 md:h-full md:w-96 md:rounded-none md:rounded-l-lg"
                          src={`data:image/jpeg;base64,${post?.image[0].preview}`}
                          alt={post._id}
                        />
                        <div className="flex flex-col justify-between p-4 leading-normal ">
                          <Link className="w-full" to={`/posts/${post?._id}`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight md:truncate md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-lg  text-gray-900 hover:text-green-600 cursor-pointer">
                              {post?.title}
                            </h5>
                          </Link>
                          <p className="mb-3 font-normal text-gray-700 ">
                            Địa chỉ:&#160;{post?.addressDetail},&#160;
                            {post.ward?.prefix ? post.ward?.prefix + " " : ""}
                            {post.ward?.name},&#160;
                            {post.district?.name},&#160;
                            {post.city?.name}
                          </p>
                          <div className="flex flex-row justify-start w-full  items-center ">
                            {/* Likes */}
                            <div className="flex flex-row justify-center items-center ml-0 mr-4 pb-2 pt-1">
                              {/* Togle like  */}
                              <div className="">
                                <AiFillLike
                                  onClick={() =>
                                    dispatch(
                                      likePostAction({
                                        userId: user?.userAuth?._id,
                                        postId: post?._id,
                                      })
                                    )
                                  }
                                  className="h-7 w-7 text-blue-600 cursor-pointer"
                                />
                              </div>
                              <div className="pl-2 text-gray-600">
                                {post?.likes?.length}
                              </div>
                            </div>
                            {/* Dislike */}
                            <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                              <div>
                                <AiFillDislike
                                  onClick={() =>
                                    dispatch(
                                      disLikePostAction({
                                        userId: user?.userAuth?._id,
                                        postId: post?._id,
                                      })
                                    )
                                  }
                                  className="h-7 w-7 cursor-pointer text-red-600"
                                />
                              </div>
                              <div className="pl-2 text-gray-600">
                                {post?.disLikes?.length}
                              </div>
                            </div>
                            {/* Views */}
                            <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1 ">
                              <div>
                                <BsEye className="h-7 w-7  text-gray-400" />
                              </div>
                              <div className="pl-2 text-gray-600">
                                {post?.numViews}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-wrap justify-start w-full  items-center ">
                            {/* Description */}
                            <div className="flex flex-row justify-center items-center ml-0 mr-4 pb-2 pt-1">
                              {/* Price  */}
                              <div className="text-lg text-green-600 font-semibold">
                                {new Intl.NumberFormat("de-DE").format(
                                  post?.price
                                )}
                              </div>
                              <div className="pl-2 text-gray-600">/tháng</div>
                            </div>
                            {/* Acreage */}
                            <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                              <div className="text-md font-semibold">
                                {new Intl.NumberFormat("de-DE").format(
                                  post?.acreage
                                )}
                              </div>
                              <div className="pl-2 text-gray-600">m2</div>
                            </div>
                            {/* Water Price */}
                            <div className="flex flex-row justify-center items-center ml-4 md:ml-0 mr-4 pb-2 pt-1">
                              <div className="text-md font-semibold">
                                {new Intl.NumberFormat("de-DE").format(
                                  post?.waterPrice
                                )}
                              </div>
                              <div className="pl-2 text-gray-600">/Khối</div>
                            </div>
                            {/* Electricity Price */}
                            <div className="flex flex-row justify-center items-center ml-4 md:ml-0 mr-4 pb-2 pt-1">
                              <div className="text-md font-semibold">
                                {new Intl.NumberFormat("de-DE").format(
                                  post?.electricityPrice
                                )}
                              </div>
                              <div className="pl-2 text-gray-600">/Kwh</div>
                            </div>
                          </div>
                          <div className="mt-6 md:mt-2 flex items-center">
                            <div className="flex-shrink-0">
                              <Link>
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`data:image/jpeg;base64,${post?.user?.profilePhoto[0]?.preview}`}
                                  alt=""
                                />
                              </Link>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                <Link
                                  to={`/profile/${post?.user?._id}`}
                                  className="text-base hover:underline text-gray-800"
                                >
                                  {post?.user?.firstName} {post?.user?.lastName}
                                </Link>
                              </p>
                              <div className="flex space-x-1 font-sans text-sm italic text-gray-400">
                                <time>
                                  {post.updatedAt === post.createdAt ? (
                                    <DateFormatter date={post?.createdAt} />
                                  ) : (
                                    <DateFormatter date={post?.updatedAt} />
                                  )}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* insert below there */}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* paging */}
        {totalPage > 1 ? (
          <Paging
            totalPage={totalPage}
            onchangePage={handleChangePage}
            onPrevClickPage={handlePrevClick}
            onNextClickPage={handleNextClick}
            currentPage={currentPage}
          />
        ) : (
          ""
        )}
        {/* <div className="bg-gray-900">
          <div className="skew bg-green-500 skew-bottom mr-for-radius">
            <svg
              className="h-8 md:h-12 lg:h-10 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 0 10"></polygon>
            </svg>
          </div>
          <div className="skew bg-gray-500  skew-bottom ml-for-radius">
            <svg
              className="h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 10 10"></polygon>
            </svg>
          </div>
        </div> */}
      </section>
    </>
  );
}

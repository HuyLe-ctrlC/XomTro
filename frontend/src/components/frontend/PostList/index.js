import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllAction,
  selectPosts,
} from "../../../redux/slices/posts/postsSlices";
import DateFormatter from "../../../utils/DateFormatter";
import {
  getAllAction as getCategories,
  selectCategory,
} from "../../../redux/slices/category/categorySlice";
import LoadingComponent from "../../Loading/Loading";
import { BsEye } from "react-icons/bs";
import { BiLike, BiDislike } from "react-icons/bi";
import { Paging } from "../../Paging/Paging";

export default function PostsList() {
  const title = "Các tin đăng";
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
  };
  const paramsGetAll = {
    keyword: "",
    offset: 0,
    limit: 10,
  };

  //select post from store
  const posts = useSelector(selectPosts);
  const { data, loading, totalPage, appErr, serverErr, likes, dislikes } =
    posts;
  // console.log(data);
  //select categories from store
  const category = useSelector(selectCategory);
  const {
    data: dataCategory,
    loading: catLoading,
    appErr: catAppErr,
    serverErr: catServerErr,
  } = category;
  //dispatch
  const dispatch = useDispatch();
  //fetch post

  const getData = () => {
    document.title = title;
    // console.log("keyword", params.keyword);
    dispatch(getAllAction(params));
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    dispatch(getAllAction());
  }, [dispatch, likes, dislikes]);
  //fetch categories
  useEffect(() => {
    dispatch(getCategories(paramsGetAll));
  }, [dispatch]);
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
      getData();
    }
  };
  // change page event
  const handleChangePage = (page) => {
    params.offset = (page - 1) * limit;
    setCurrentPage(page);
    getData();
  };
  return (
    <>
      <section>
        <div className="py-20 bg-gray-900 min-h-screen radius-for-skewed">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-wrap items-center">
              <div className="w-full lg:w-1/2">
                <span className="text-green-600 font-bold">
                  Các nhà trọ tốt nhất do XomTro tuyển chọn
                </span>
                <h2 className="text-4xl text-gray-300 lg:text-5xl font-bold font-heading">
                  Bài viết mới nhất
                </h2>
              </div>
              <div className=" block text-left md:text-right w-1/2 mt-4 md:mt-0">
                {/* View All */}
                <button
                  onClick={() => dispatch(getAllAction(params))}
                  className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose transition duration-200"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
                <div className="py-4 px-6 bg-gray-600 shadow rounded">
                  <h4 className="mb-4 text-gray-500 font-bold uppercase">
                    Loại nhà
                  </h4>
                  <ul>
                    {catLoading ? (
                      <LoadingComponent />
                      // <h1 className="text-yellow-400 text-lg text-center">
                      //   Không tìm thấy thể loại
                      // </h1>
                    ) : catAppErr || catServerErr ? (
                      <h1>
                        {catServerErr} {catAppErr}
                      </h1>
                    ) : dataCategory?.length <= 0 ? (
                      <h1 className="text-yellow-400 text-lg text-center">
                        Không tìm thấy thể loại
                      </h1>
                    ) : (
                      dataCategory?.map((category) => (
                        <li key={category._id}>
                          <p
                            // onClick={() =>
                            //   dispatch(fetchPostsAction(category?.title))
                            // }
                            className="block cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500"
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

                {appErr || serverErr ? (
                  <h1 className="text-yellow-600 text-center text-lg ">
                    {serverErr} {appErr}
                  </h1>
                ) : data?.length <= 0 ? (
                  <h1 className="text-yellow-400 text-lg text-center">
                    No Post Found
                  </h1>
                ) : (
                  data?.map((post) => (
                    <div
                      key={post._id}
                      className="flex flex-wrap bg-gray-900 -mx-3 lg:mb-6"
                    >
                      <div className="mb-10 w-full lg:w-1/4 h-80">
                        <Link>
                          {/* Post image */}
                          <img
                            className="w-full h-full object-cover rounded"
                            src={`data:image/jpeg;base64,${post?.image[0].preview}`}
                            alt=""
                          />
                        </Link>
                        {/* Likes, views dislikes */}
                        <div className="flex flex-row bg-gray-300  justify-center w-full  items-center ">
                          {/* Likes */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            {/* Togle like  */}
                            <div className="">
                              <BiLike
                                // onClick={() =>
                                //   dispatch(toggleAddLikesToPost(post?._id))
                                // }
                                className="h-7 w-7 text-indigo-600 cursor-pointer"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.likes?.length}
                            </div>
                          </div>
                          {/* Dislike */}
                          <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <BiDislike
                                // onClick={() =>
                                //   dispatch(toggleAddDisLikesToPost(post?._id))
                                // }
                                className="h-7 w-7 cursor-pointer text-gray-600"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.disLikes?.length}
                            </div>
                          </div>
                          {/* Views */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <BsEye className="h-7 w-7  text-gray-400" />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.numViews}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-3/4 px-3">
                        <Link className="hover:underline">
                          <h3 className="mb-1 text-2xl text-green-400 font-bold font-heading">
                            {/* {capitalizeWord(post?.title)} */}
                            {post?.title}
                          </h3>
                        </Link>
                        <p className="text-gray-300">{post?.title}</p>
                        {/* Read more */}
                        <Link
                          to={`/posts/${post?._id}`}
                          className="text-indigo-500 hover:underline"
                        >
                          Read More..
                        </Link>
                        {/* User Avatar */}
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                            <Link>
                              <img
                                className="h-10 w-10 rounded-full"
                                src={post?.user?.profilePhoto}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              <Link
                                to={`/profile/${post?.user?._id}`}
                                className="text-yellow-400 hover:underline "
                              >
                                {post?.user?.firstName} {post?.user?.lastName}
                              </Link>
                            </p>
                            <div className="flex space-x-1 text-sm text-green-500">
                              <time>
                                <DateFormatter date={post?.createdAt} />
                              </time>
                              <span aria-hidden="true">&middot;</span>
                            </div>
                          </div>
                        </div>
                        {/* <p className="text-gray-500">
                             Quisque id sagittis turpis. Nulla sollicitudin rutrum
                             eros eu dictum...
                           </p> */}
                      </div>
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

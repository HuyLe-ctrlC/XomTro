import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  selectPosts,
  getByIdAction,
} from "../../../../redux/slices/posts/postsSlices";
import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";
import Description from "./Description";
import Footer from "../../../Footer";
// import LoadingComponent from "../../utils/LoadingComponent";
// import AddComment from "../Comments/AddComment";
// import CommentsList from "../Comments/CommentsList";

const PostDetails = () => {
  let { postId } = useParams();

  const dispatch = useDispatch();

  //select post details from store
  const post = useSelector(selectPosts);
  const { dataUpdate, loading, appErr, serverErr } = post;

  //comment
  // const comment = useSelector((state) => state.comment);
  // const { commentCreated, commentDeleted } = comment;
  useEffect(() => {
    dispatch(getByIdAction(postId));
  }, [postId, dispatch]);

  //redirect
  //   if (isDeleted) return <Redirect to="/posts" />;
  return (
    <>
      {loading ? (
        <div className="h-screen">{/* <LoadingComponent /> */}</div>
      ) : appErr || serverErr ? (
        <h1 className="h-screen text-red-400 text-xl">
          {serverErr} {appErr}
        </h1>
      ) : (
        <section className="py-10 2xl:py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col max-w-7xl">
              <Header />
              <Description />
              <Footer />
            </div>
          </div>
          {/* Add comment Form component here */}
          {/* {userAuth ? <AddComment postId={id} /> : null}
          <div className="flex justify-center  items-center">
            <CommentsList comments={postDetails?.comments} />
          </div> */}
        </section>
      )}
    </>
  );
};

export default PostDetails;

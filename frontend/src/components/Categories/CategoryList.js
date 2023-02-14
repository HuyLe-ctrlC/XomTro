import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAction,
  selectCategory,
} from "../../redux/slices/category/categorySlice";
import Loading from "../Loading/Loading";
import { HiPencilAlt } from "react-icons/hi";
export const CategoryList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAction());
  }, [dispatch]);
  const category = useSelector(selectCategory);

  const { categoryList, loading, appError, serverError } = category;

  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : appError || serverError ? (
        <h2 className="text-center text-3xl text-red-600">
          {serverError} {appError}
        </h2>
      ) : categoryList?.length <= 0 ? (
        <h2 className="text-center text-3xl text-green-800">
          No category Found
        </h2>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tác giả
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tên thể loại
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tạo ngày
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryList?.map((category) => (
                      <tr className="bg-gray-50" key={category._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={category?.user?.profilePhoto}
                                alt="category profile"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {category?.user?.firstName}{" "}
                                {category?.user?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {category?.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* {<DateFormatter date={category?.createdAt} />} */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/update-category/${category?._id}`}>
                            <HiPencilAlt className="h-5 text-indigo-500 text-center" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

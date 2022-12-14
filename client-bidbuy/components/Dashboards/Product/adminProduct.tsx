import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAuthenticatedFetch from "../../../hooks/useAuthenticatedFetch";
import { jsxService } from "../../../service";
import { IProduct } from "../../../types";
import Layout from "../../Layout";

const AdminProduct = () => {
  const { tokenRefreshed, user } = useAuth();
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
    setData,
  } = useAuthenticatedFetch<IProduct[]>("product/", [tokenRefreshed, user]);

  return (
    <Layout role="admin">
      <h1 className="mt-8">Products</h1>
      {isProductsLoading && <p>Loading products...</p>}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-7 p-8">
        <div className="flex justify-between items-center pb-4 bg-white ">
          <div></div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for users"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">
                Username
                <div className="font-normal text-gray-500">Email</div>
              </th>

              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Address
              </th>
              <th scope="col" className="py-3 px-6">
                Phone
              </th>
              <th scope="col" className="py-3 px-6">
                Nid
              </th>
              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!!products &&
              products
                .filter((p) => p.status !== "sold")
                .map((p) => (
                  <Productitem
                    setData={setData}
                    p={p}
                    key={p.id}
                    refetch={refetch}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
export default AdminProduct;
const Productitem = ({
  p,
  refetch,
  setData,
}: {
  p: IProduct;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<IProduct[] | null | undefined>>;
}) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <th
        scope="row"
        className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap"
      >
        <div className="pl-3">
          <div className="text-base font-semibold">{p.name}</div>
          <div className="font-normal text-gray-500">{p.category}</div>
        </div>
      </th>
      <td className="py-4 px-6">{p.description}</td>
      <td className="py-4 px-6">
        <div className="flex items-center">{p.seller?.kyc?.name}</div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center">{p.price}</div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full mr-2 ${
              p.status.trim() === "listed" ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          {p.status}
        </div>
      </td>
      <td className="py-4 px-6">
        <button
          onClick={() => handleStatus(p.id, p.status, refetch, setData)}
          type="button"
          className={`w-28 ${
            p.status.trim() === "pending"
              ? "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              : "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
          }`}
        >
          {p.status.trim() === "pending" ? "Approve" : "Reject"}
        </button>
      </td>
    </tr>
  );
};
function handleStatus(
  id: number,
  status: string,
  refetch: () => void,
  setData: React.Dispatch<React.SetStateAction<IProduct[] | null | undefined>>
): void {
  console.log(id, status);
  const param = status.trim() == "pending" ? "listed" : "pending";
  console.log(param);
  setData((data) =>
    !!data ? data.map((d) => (d.id === id ? { ...d, status: param } : d)) : data
  );
  jsxService()
    .put(`/product/changeStatus?id=${id}&status=${param}`)
    .then((res) => {
      console.log(res);
      refetch();
    })
    .catch((err) => {
      console.log(err);
    });
}

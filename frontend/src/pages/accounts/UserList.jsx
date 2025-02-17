import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOfficeBuilding,
  HiCheckCircle,
  HiClipboardList,
  HiPencil,
  HiTrash,
  HiUser,
  HiUserAdd,
  HiXCircle,
} from "react-icons/hi";
import { Table } from "flowbite-react";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import api from "../../services/api/endpoint";
import { formatDate } from "../../utils/formatting";
import IconBadge from "../../components/IconBadge";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await api.get("/api/users/");
    setUsers(response.data);
    try {
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardMainLayout>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-full px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/2"></div>

                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to="/admin/users/add"
                      type="button"
                      className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <HiUserAdd className="h-4 w-4 mr-2" />
                      Add new user
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>User</Table.HeadCell>
                      <Table.HeadCell>Email</Table.HeadCell>
                      <Table.HeadCell>Username</Table.HeadCell>
                      <Table.HeadCell>Role</Table.HeadCell>
                      <Table.HeadCell>Date joined</Table.HeadCell>
                      <Table.HeadCell>Last login</Table.HeadCell>
                      <Table.HeadCell>Is active</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Actions</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <Table.Row
                            key={user.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{user.username}</Table.Cell>
                            <Table.Cell>
                              <IconBadge role={user.role} />
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(user.dateJoined)}
                            </Table.Cell>
                            <Table.Cell>
                              {user.last_login
                                ? formatDate(user.lastLogin)
                                : ""}
                            </Table.Cell>
                            <Table.Cell>
                              {user.isActive ? (
                                <HiCheckCircle className="text-green-600 w-5 h-5" />
                              ) : (
                                <HiXCircle className="text-red-600 w-5 h-5" />
                              )}
                            </Table.Cell>
                            <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                              <Link
                                // to={`/admin/categories/${category.id}/edit`}
                                type="button"
                                className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                              >
                                <HiPencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                              >
                                <HiTrash className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <DashboardTableNoDataRow columns={8} />
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardMainLayout>
  );
}

export default UserList;

import { useEffect, useState } from "react";
import { Space, Table, Button, Flex, Card, Spin, Row, Col, Modal } from "antd";
import { PlusSquareTwoTone } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

import { useAppSelector } from "../../../app/store";
import { baseAPI } from "../../../api";
import AdminLayout from "../../../layouts/admin.layout";
import { ListUsersProps } from "../../../utils/types/users";

const columns: TableProps<ListUsersProps>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    responsive: ["md"],
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    responsive: ["md"],
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/admin/users/form/${record.id}`}>Edit</Link>
      </Space>
    ),
  },
];

const UserListPage: React.FC = () => {
  const [data, setData] = useState<ListUsersProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    main: {
      data: { data: UserData },
    },
  } = useAppSelector((state) => state.authState);

  useEffect(() => {
    const getUsers = async (): Promise<ListUsersProps[]> => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseAPI.dev}/users`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setData(
            response.data.data.map((item: ListUsersProps) => ({
              key: item.id,
              id: item.id,
              name: item.name,
              role: item.role,
              phone: item.phone,
            }))
          );
        }

        setIsLoading(false);
      } catch (error) {
        throw error;
      }
      return []; // Add this return statement
    };

    getUsers();

    // clean up
    return () => {
      setData([]);
    };
  }, []);

  return (
    <AdminLayout>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "#9c9c9ca3",
            position: "absolute",
            top: 0,
            left: 0,
          }}>
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Spin />
          </div>
        </div>
      ) : null}
      <div>
        <Flex justify="space-between" align="center">
          <div>
            <h1>Daftar User</h1>
            <p>Tabel daftar dari user semua role</p>
          </div>
          <div>
            <Link to="/admin/users/form">
              <Button
                color="primary"
                variant="solid"
                icon={<PlusSquareTwoTone />}>
                Tambah
              </Button>
            </Link>
          </div>
        </Flex>
        <Table<ListUsersProps>
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  <Card title="Menu" className="grid-menu">
                    <Row>
                      <Col xs={24} sm={12} md={8}>
                        <Card.Grid style={{ width: "100%", height: "100%" }}>
                          <Link to={`/admin/decree/${record.id}`}>
                            Surat Keputusan
                          </Link>
                        </Card.Grid>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Card.Grid style={{ width: "100%", height: "100%" }}>
                          <Link to={`/admin/portfolio/${record.id}`}>
                            Portofolio
                          </Link>
                        </Card.Grid>
                      </Col>
                      {UserData?.userId !== record.id ? (
                        <Col xs={24} sm={12} md={8}>
                          <Card.Grid style={{ width: "100%", height: "100%" }}>
                            <DeleteButton
                              id={record.id}
                              data={data}
                              setData={setData}
                            />
                          </Card.Grid>
                        </Col>
                      ) : null}
                    </Row>
                  </Card>
                </>
              );
            },
          }}
        />
      </div>
    </AdminLayout>
  );
};

const DeleteButton = ({
  id,
  data,
  setData,
}: {
  id: number;
  data: ListUsersProps[];
  setData: React.Dispatch<React.SetStateAction<ListUsersProps[]>>;
}) => {
  const deleteAction = async (id: number) => {
    try {
      await axios.delete(`${baseAPI.dev}/users/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      // find the user from state and remove it
      const updatedData = data.filter((user) => user.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Button
        type="text"
        danger
        onClick={() => {
          Modal.confirm({
            title: "Konfirmasi",
            content:
              "Apakah Anda yakin ingin menghapus user ini? (data-data yang berkaitan dengan user ini akan ikut terhapus)",
            okText: "Ya",
            okType: "danger",
            cancelText: "Tidak",
            onOk: () => deleteAction(id),
          });
        }}>
        Hapus
      </Button>
    </>
  );
};

export default UserListPage;

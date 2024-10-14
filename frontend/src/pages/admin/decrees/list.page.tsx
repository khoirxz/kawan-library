import { useState, useEffect } from "react";
import { Space, Table, Button, Flex, Typography } from "antd";
import type { TableProps } from "antd";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseAPI } from "../../../api";

import AdminLayout from "../../../layouts/admin.layout";
import { ListDecreeProps } from "../../../utils/types/decrees";
import { UserProps } from "../../../utils/types/users";

const columns: TableProps<ListDecreeProps>["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Kategori",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    responsive: ["md"],
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/admin/decree/form/edit/${record.user_id}/${record.id}`}>
          Edit
        </Link>
        <Link to={`/admin/decrees/form/${record.id}`}>
          <Typography.Text
            style={{
              color: "red",
            }}>
            Delete
          </Typography.Text>
        </Link>
      </Space>
    ),
  },
];

const DecreeListPage = () => {
  const [user, setUser] = useState<UserProps>();
  const [decreeList, setDecreeList] = useState<ListDecreeProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/users/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.data[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {
      setIsLoading(false);
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/decrees/user/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.data.map((item: ListDecreeProps) => {
            // setDecreeList((prev) => [...prev, item]);
            return {
              key: item.id,
              id: item.id,
              user_id: item.user_id,
              title: item.title,
              description: item.title,
              category: item.category,
              status: item.status,
              effective_date: item.effective_date,
              expired_date: item.expired_date,
              file_path: item.file_path,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          });
          setDecreeList(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {
      setIsLoading(false);
    };
  }, [id]);

  return (
    <AdminLayout>
      <div>
        <Flex justify="space-between" align="center">
          <div>
            <h3>{user?.name}</h3>
            <h1>Daftar Surat Keputusan </h1>
            <p>Tabel daftar dari semua surat keputusan</p>
          </div>
          <div>
            <Link to={`/admin/decree/form/add/${id}`}>
              <Button color="primary" variant="solid">
                Tambah
              </Button>
            </Link>
          </div>
        </Flex>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table<ListDecreeProps> columns={columns} dataSource={decreeList} />
        )}
      </div>
    </AdminLayout>
  );
};

export default DecreeListPage;

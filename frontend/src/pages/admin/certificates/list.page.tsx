import { useState, useEffect } from "react";
import { Space, Table, Button, Flex } from "antd";
import type { TableProps } from "antd";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { baseAPI } from "../../../api";

import AdminLayout from "../../../layouts/admin.layout";
import { UserProps } from "../../../utils/types/users";
import { ListCertificationsProps } from "../../../utils/types/certifications";

const columns: TableProps<ListCertificationsProps>["columns"] = [
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tanggal",
    dataIndex: "date",
    key: "date",
    render: (value) => dayjs(value).format("DD MMMM YYYY"),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space>
        <Link to={`/admin/portofolio/form/edit/${record.user_id}/${record.id}`}>
          Edit
        </Link>
      </Space>
    ),
  },
];

const CertificateListPage: React.FC = () => {
  const [user, setUser] = useState<UserProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [certificateList, setCertificateList] = useState<
    ListCertificationsProps[]
  >([]);

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
        const response = await axios.get(
          `${baseAPI.dev}/certifications/user/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data.map(
            (item: ListCertificationsProps) => {
              return {
                key: item.id,
                id: item.id,
                name: item.name,
                date: item.date,
                user_id: item.user_id,
              };
            }
          );

          setCertificateList(data);
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
            <h1>Daftar Sertifikat Portofolio</h1>
            <p>Tabel daftar dari semua sertifikat dari user {user?.name}</p>
          </div>
          <div>
            <Link to={`/admin/portofolio/form/add/${id}`}>
              <Button color="primary" variant="solid">
                Tambah
              </Button>
            </Link>
          </div>
        </Flex>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table<ListCertificationsProps>
            columns={columns}
            dataSource={certificateList}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CertificateListPage;

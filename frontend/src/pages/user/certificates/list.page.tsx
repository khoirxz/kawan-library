import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Space,
  Input,
  Card,
  Flex,
  Button,
  Tag,
  Breadcrumb,
} from "antd";
import { ExportOutlined, WarningOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { baseAPI } from "../../../api";

import { ListCertificationsProps } from "../../../utils/types/certifications";
import UserLayout from "../../../layouts/user.layout";

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
        <Tag
          style={{ cursor: "pointer" }}
          icon={<ExportOutlined />}
          onClick={() =>
            window.open(
              `${baseAPI.dev}/uploads/certificates/${record.file_path}`
            )
          }>
          lihat file
        </Tag>
        <Tag color="red" icon={<WarningOutlined />}>
          Report
        </Tag>
      </Space>
    ),
  },
];

const UserCertificationListPage: React.FC = () => {
  const [certificateList, setCertificateList] = useState<
    ListCertificationsProps[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/certifications`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.data.map(
            (item: ListCertificationsProps) => {
              return {
                key: item.id,
                id: item.id,
                name: item.name,
                date: item.date,
                user_id: item.user_id,
                file_path: item.file_path,
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
  }, []);

  return (
    <UserLayout>
      <Row>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: <Link to="/home">Home</Link>,
              },
              {
                title: <Link to="/certificate">Sertifikat</Link>,
              },
            ]}
          />

          <h1>Daftar Sertifikat</h1>
          <Card>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}>
              <div>
                <Link to="/portfolio">
                  <Button>Lihat Portofolio</Button>
                </Link>
              </div>
            </Flex>

            <div style={{ marginBottom: 16 }}>
              <Input />
            </div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Table<ListCertificationsProps>
                columns={columns}
                dataSource={certificateList}
              />
            )}
          </Card>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default UserCertificationListPage;

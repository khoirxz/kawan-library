import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Space,
  Input,
  Breadcrumb,
  Tag,
  Typography,
  Flex,
} from "antd";
import { ExportOutlined, WarningOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { baseAPI } from "../../../api";

import { ListDecreeProps } from "../../../utils/types/decrees";
import UserLayout from "../../../layouts/user.layout";
import { Link } from "react-router-dom";

const columns: TableProps<ListDecreeProps>["columns"] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Kategori",
    dataIndex: "category",
    key: "category",
    responsive: ["md"],
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => <Tag color="green">{text}</Tag>,
  },
  {
    title: "Action",
    key: "action",
    responsive: ["md"],
    render: (_, record) => (
      <Space>
        <Tag
          style={{ cursor: "pointer" }}
          icon={<ExportOutlined />}
          onClick={() =>
            window.open(`${baseAPI.dev}/uploads/decrees/${record.file_path}`)
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

const UserDecreeListPage: React.FC = () => {
  const [decressList, setDecressList] = useState<ListDecreeProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/decrees`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.data.map((item: ListDecreeProps) => {
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
          setDecressList(data);
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
                title: <Link to="/decrees">Surat Keputusan</Link>,
              },
            ]}
          />

          <h1>Surat Keputusan</h1>

          <div style={{ marginBottom: 16 }}>
            <Input />
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table<ListDecreeProps>
              columns={columns}
              dataSource={decressList}
              expandable={{
                expandedRowRender: (record) => (
                  <>
                    <Flex vertical>
                      <Typography.Title level={5}>Deskripsi</Typography.Title>
                      <Typography.Paragraph>
                        {record.description}
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        {dayjs(record.createdAt).format("DD MMMM YYYY")}
                      </Typography.Paragraph>
                      <div>
                        <Tag
                          color="green"
                          onClick={() =>
                            window.open(
                              `${baseAPI.dev}/uploads/decrees/${record.file_path}`
                            )
                          }>
                          Lihat File
                        </Tag>
                      </div>
                    </Flex>
                  </>
                ),
              }}
            />
          )}
        </Col>
      </Row>
    </UserLayout>
  );
};

export default UserDecreeListPage;

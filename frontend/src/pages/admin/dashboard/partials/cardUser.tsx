import { useEffect, useState } from "react";
import { Card, Flex, Skeleton } from "antd";
import axios from "axios";
import { baseAPI } from "../../../../api";

const CardUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalUser, setTotalUser] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseAPI.dev}/users`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          setIsLoading(false);
          setTotalUser(response.data.data.length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Skeleton active loading={isLoading}>
      <Card>
        <Flex gap={5} align="center">
          <p>Total User</p>
        </Flex>
        <h4 style={{ fontSize: "38px", margin: "0" }}>{totalUser}</h4>
      </Card>
    </Skeleton>
  );
};

export default CardUser;

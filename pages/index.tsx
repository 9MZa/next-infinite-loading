import type { NextPage } from "next";
import React, { useEffect } from "react";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import {
  Box,
  Center,
  Loader,
  Container,
  Title,
  LoadingOverlay,
} from "@mantine/core";
const pokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=10";

const fetchPokemon = async ({ pageParam = pokeUrl }) => {
  const request = await axios.get(pageParam).then((res) => res.data);
  const { results, next } = await request;

  console.log("request", request);

  return { response: results, nextPage: next };
};

const Home: NextPage = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("pokemon", fetchPokemon, {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  interface Poke {
    id: string;
    name: string;
  }
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Container>
      <Box sx={{ padding: "50px" }}>
        <Title>React Query</Title>
      </Box>
      {isLoading ? (
        <LoadingOverlay visible={true} />
      ) : (
        <div>
          {data?.pages.map((group) =>
            group.response.map((item: Poke, i: any) => (
              <div key={i}>
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                    textAlign: "center",
                    padding: theme.spacing.xl,
                    borderRadius: theme.radius.md,
                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                    },
                  })}
                >
                  <Title> {item.name} </Title>
                </Box>
              </div>
            ))
          )}
        </div>
      )}

      {isFetchingNextPage ? (
        <Center style={{ paddingTop: 50 }}>
          <Loader />
        </Center>
      ) : (
        ""
      )}
      <Box sx={{ opacity: 0 }} ref={ref}>
        <h2>{`Header inside viewport ${inView}.`}</h2>
      </Box>
    </Container>
  );
};

export default Home;

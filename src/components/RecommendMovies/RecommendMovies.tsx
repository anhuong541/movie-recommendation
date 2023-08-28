"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RMCard from "./RecommendMoviesCard";

const moviesData = require("@/data/data.json").movies;

const movieGenreInteface = [
  "Action",
  "Mystery",
  "Horror",
  "Drama",
  "Animation",
] as const;

const movieTypeInteface = ["Movie", "TVSeries"] as const;

const yearOldReleasted = ["does'tmatter", "3", "5", "10"] as const;

const formSchema = z.object({
  movieGenre: z.enum(movieGenreInteface),
  movieType: z.enum(movieTypeInteface),
  rating: z.string(),
  movieYear: z.enum(yearOldReleasted),
});

export default function RecommendationMoviesCom() {
  const [userData, setUserData] = useState<z.infer<typeof formSchema>>();
  const [isLoadinng, setIsLoadinng] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieGenre: "Action",
      movieType: "Movie",
      rating: "0",
      movieYear: "does'tmatter",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(userValues: z.infer<typeof formSchema>) {
    // console.log("data", userValues);
    setIsLoadinng(true);
    setUserData(userValues);
    setIsLoadinng(false);
  }

  const handleFilterData = (e: any) => {
    if (e.rating.star >= Number(userData?.rating) / 10) {
      if (e.contentType == userData?.movieType) {
        if (e.genre.includes(userData?.movieGenre)) {
          if (userData?.movieYear === "does'tmatter") {
            return e;
          } else if (
            e.releaseDetailed.year <
            2023 - Number(userData?.movieYear)
          ) {
            return e;
          }
        }
      }
    }
    return;
  };

  const filterMovieData = moviesData.filter(handleFilterData);
  //.filter(handleFilterData)
  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center py-10">
        <div className="flex flex-col px-8 py-10 border-2 border-black dark:border-slate-300 rounded-lg w-[700px]">
          <h1>Please answer some question so we can understand you</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-10"
            >
              <FormField
                control={form.control}
                name="movieGenre"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Chosse Genre Movie</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup {...field}>
                              <SelectItem value="Action">Action</SelectItem>
                              <SelectItem value="Mystery">Mystery</SelectItem>
                              <SelectItem value="Drama">Drama</SelectItem>
                              <SelectItem value="Horror">Horror</SelectItem>
                              <SelectItem value="Animation">
                                Animation
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="movieType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Chosse Type Movie</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup {...field}>
                              <SelectItem value="Movie">Movie</SelectItem>
                              <SelectItem value="TVSeries">TvShows</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="movieYear"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        How old would you like the movie to be?
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup {...field}>
                              <SelectItem value="does'tmatter">
                                Doesn't matter
                              </SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                              <SelectItem value="10">10 years</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Movie score need to higher than</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="how many score do you want for the movie"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
      <hr className="my-10" />
      {/* render movies list */}
      {isLoadinng == true ? (
        "You are not choose option or the movies are loading"
      ) : (
        <div className="grid 4xl:grid-cols-9 xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 ss:grid-cols-1 gap-10">
          {filterMovieData.map((item: any) => {
            const rating = item.rating.star * 10;
            const title = item.title;
            const date =
              item.releaseDetailed.month +
              "/" +
              item.releaseDetailed.day +
              "/" +
              item.releaseDetailed.year;

            return (
              <RMCard
                rating={rating}
                title={title}
                img={item.image}
                key={item.id}
                id={item.id}
                date={date}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

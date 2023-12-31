"use client";

import { handleGetdApi } from "@/lib/getdatafromapi";
import { useEffect, useState } from "react";
import { MovieCard } from "../MoviesRender";
import Link from "next/link";
import Image from "next/image";
import DemoCard from "./DemoCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const moviesData = require("@/data/data.json").movies;

const movieGenreInteface = [
  "Action",
  "Mystery",
  "Horror",
  "Drama",
  "Animation",
] as const;

const movieTypeInteface = ["Movie", "TvShows"] as const;

const formSchema = z.object({
  username: z.string().min(1, { message: "you have to type your name" }),
  movieGenre: z.enum(movieGenreInteface),
  movieType: z.enum(movieTypeInteface),
});

export default function ClientDemo() {
  const [userData, setUserData] = useState<z.infer<typeof formSchema>>();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      movieGenre: "Action",
      movieType: "Movie",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(userValues: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("data", userValues);
    setUserData(userValues);
  }

  const handleFilterData = (e: any) => {
    if (e.rating.star >= 0) {
      if (e.contentType == "Movie") {
        if (e.genre.includes(userData?.movieGenre)) {
          return e;
        }
      }
    }
    return;
  };

  const filterMovieData = moviesData.filter(handleFilterData);

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center py-10">
        <div className="flex flex-col px-8 py-10 border rounded-lg bg-blue-300 w-[700px]">
          <h1>Please answer some question so we can understand you</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              // onSubmit={(e) => {
              //   console.log("it run!!!!");
              //   e.preventDefault();
              //   return form.handleSubmit(onSubmit);
              // }}
              className="space-y-8 mt-10"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup {...field}>
                              <SelectItem value="Movie">Movie</SelectItem>
                              <SelectItem value="TvShows">
                                TvShows (not update yet)
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
      <hr />
      {/* render movies list */}
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 ss:grid-cols-1 gap-10">
        {userData != undefined &&
          filterMovieData.map((item: any) => {
            const rating = (item as any)?.rating.star * 10;
            const title = (item as any)?.title;

            return (
              <DemoCard
                rating={rating}
                title={title}
                img={item.image}
                key={item.id}
              />
            );
          })}
      </div>
    </div>
  );
}

"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { error } from "console";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    // console.log(value.name); // passed
    // TODO: Create Store
    try {
      setLoading(true);

      // throw new Error("x"); // Trail with error -> success

      const response = await axios.post("/api/stores", value);

      // console.log("[Data] -> ", response.data); // passed
      // toast.success("Package Created!");

      window.location.assign(`/${response.data.id}`); // why using this? -> It will do a hard reloading ensuring the page is properly loaded. (otherwise, the modal would have remained there giving a bad UX)
    } catch (error) {
      // console.log("[STORE-MODAL.TSX] ->", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Destination"
      description="Add a new destination to manage tours and packages"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Travel Destination"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant={"outline"}
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
// This modal should be available throughout the application no matter from which page

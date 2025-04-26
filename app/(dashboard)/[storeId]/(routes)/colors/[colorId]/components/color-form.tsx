"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Duration } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useState } from "react";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1),
  days: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: "Color must be a valid hex code (e.g., #FF0000)",
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Duration | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit color" : "Add a new color";
  const toastMessage = initialData ? "Color Updated." : "Color created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      days: "#000000", // Default black color
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // Still using durations API endpoint
        await axios.patch(
          `/api/${params.storeId}/durations/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/durations`, data);
      }
      router.refresh();

      router.push(`/${params.storeId}/colors`);

      toast.success(toastMessage);
    } catch {
      toast.error("Something went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Still using durations API endpoint
      await axios.delete(
        `/api/${params.storeId}/durations/${params.colorId}`
      );
      router.refresh();

      router.push(`/${params.storeId}/colors`);
      toast.success("Color Deleted");
    } catch (error: unknown) {
      console.log("[ERROR] ->", error);

      toast.error(
        "Make sure you removed all products with this color first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Value</FormLabel>
                  <div className="flex items-center gap-x-4">
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="#000000"
                        type="text"  // Use text type instead of color for more control
                        {...field}
                      />
                    </FormControl>
                    <div 
                      className="border rounded-full w-8 h-8"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
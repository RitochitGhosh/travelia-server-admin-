"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Duration } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

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
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1),
  days: z.string().min(1),
});

type DurationFormValues = z.infer<typeof formSchema>;

interface DurationFormProps {
  initialData: Duration | null;
}

export const DurationForm: React.FC<DurationFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit duration" : "Create duration";
  const description = initialData ? "Edit duration" : "Add a new duration";
  const toastMessage = initialData ? "Duration Updated." : "Duration created.";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<DurationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      days: "",
    },
  });

  const onSubmit = async (data: DurationFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/durations/${params.durationId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/durations`, data);
      }
      router.refresh();

      router.push(`/${params.storeId}/durations`);

      toast.success(toastMessage);

      console.log(data);
    } catch {
      toast.error("Something went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/durations/${params.durationId}`
      );
      router.refresh();

      router.push(`${params.storeId}/durations`); // Check here
      toast.success("Duration Deleted");
    } catch (error: unknown) {
      console.log("[ERROR] ->", error);

      toast.error(
        "Make sure you removed all packages with this duration first."
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
                      placeholder="Duration Name"
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
                  <FormLabel>Number of Days</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Number of days"
                      {...field}
                    />
                  </FormControl>
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

import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { factoryContract } from "@/constants/Constant";
import { useActiveAccount } from "thirdweb/react";

const formSchema = z.object({
  Collection_Name: z.string(),
  Collection_Symbol: z.string(),
  Brand_Name: z.string(),
  Product_Name: z.string(),
  Time: z.string(),
});

export default function FormCompo() {
  const [transactionReciept, setTransactionReciept] = useState(undefined);
  const [loading, setLoading] = useState<boolean>(false); // New state for loading
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Collection_Name: "",
      Collection_Symbol: "",
      Brand_Name: "",
      Product_Name: "",
      Time: "0",
    },
  });

  const account = useActiveAccount();

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log({ value });

    if (!account) {
      alert("Wallet not Connected");
      return;
    }

    setLoading(true); // Set loading to true when the transaction starts

    const finTime = parseInt(value.Time);
    const transaction = prepareContractCall({
      contract: factoryContract,
      method: "createContract",
      params: [
        value.Brand_Name,
        value.Product_Name,
        value.Collection_Name,
        value.Collection_Symbol,
        BigInt(finTime),
      ],
    });

    console.log("here");
    if (transaction !== undefined && account) {
      try {
        const _transactionReceipt = await sendAndConfirmTransaction({
          account: account,
          transaction: transaction,
        });
        console.log("here 2");
        console.log("The Transaction Reciept is", _transactionReceipt);
        setTransactionReciept(_transactionReceipt);
      } catch (error) {
        console.error("Transaction failed: ", error);
      } finally {
        setLoading(false); // Reset loading state after transaction completes or fails
      }
    } else {
      console.log("Transaction not found");
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="Collection_Name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Collection Name"
                      type="string"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="Collection_Symbol"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Collection Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Collection Symbol"
                      type="string"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="Brand_Name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand Name" type="string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="Product_Name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product Name"
                      type="string"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="Time"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Warranty Time</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Warranty Time"
                      type="string"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </main>
  );
}

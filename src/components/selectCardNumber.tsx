import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import gameContext from "@/gameContext";
import { useContext } from "react";

interface SelectCardNumberProps {
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

const FormSchema = z.object({
  cardNumber: z
    .string()
    .refine((value) => value !== null && value !== undefined, {
      message: "Card number is required",
    }),
});

const SelectCardNumber = ({ onSubmit }: SelectCardNumberProps) => {
  const { setCardNumber } = useContext(gameContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-5">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select card number</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">4</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-normal">5</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="6" />
                    </FormControl>
                    <FormLabel className="font-normal">6</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5 flex justify-between">
          <Button variant="secondary" type="submit">
            Start
          </Button>
          <Button
            className="p-0 w-16 h-10"
            onClick={() => {
              setCardNumber(null);
            }}
          >
            <Link
              className="w-full h-full mt-4 ml-2 mr-2 flex justify-center"
              to="/"
            >
              Back
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SelectCardNumber;

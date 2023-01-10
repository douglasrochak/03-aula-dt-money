import * as Dialog from "@radix-ui/react-dialog";
import { useContextSelector } from "use-context-selector";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from "./style";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionsContext } from "../../contexts/TransactionContext";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(["income", "outcome"]),
});

type NewTransactionInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {
  const createNewTransaction = useContextSelector(
    TransactionsContext,
    (context) => context.createNewTransaction
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: "income",
    },
  });

  async function handleCreateNewTransaction(data: NewTransactionInputs) {
    await createNewTransaction(data);
    reset();
  }

  return (
    <Dialog.Portal>
      <Overlay>
        <Content>
          <Dialog.Title>Nova Transação</Dialog.Title>
          <CloseButton>
            <X size={24} />
          </CloseButton>

          <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
            <input
              placeholder="Descrição"
              type="text"
              required
              {...register("description")}
            />
            <input
              placeholder="Preço"
              type="number"
              required
              {...register("price", { valueAsNumber: true })}
            />
            <input
              placeholder="Categoria"
              type="text"
              required
              {...register("category")}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                return (
                  <TransactionType
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <TransactionTypeButton value="income" variant="income">
                      <ArrowCircleUp size={24} />
                      Entrada
                    </TransactionTypeButton>

                    <TransactionTypeButton value="outcome" variant="outcome">
                      <ArrowCircleDown size={24} />
                      Saida
                    </TransactionTypeButton>
                  </TransactionType>
                );
              }}
            />

            <button disabled={isSubmitting} type="submit">
              Cadastrar
            </button>
          </form>
        </Content>
      </Overlay>
    </Dialog.Portal>
  );
}

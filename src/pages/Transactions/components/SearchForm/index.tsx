import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./style";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionsContext } from "../../../../contexts/TransactionContext";
import { useContextSelector } from "use-context-selector";

const SearchFormSchema = z.object({
  query: z.string().min(1),
});

type SearchFormInput = z.infer<typeof SearchFormSchema>;

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => context.fetchTransactions
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInput>({
    resolver: zodResolver(SearchFormSchema),
  });

  async function handleSearchTransactions(data: SearchFormInput) {
    await fetchTransactions(data.query);
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register("query")}
      />
      <button disabled={isSubmitting} type="submit">
        <MagnifyingGlass size={20} /> Buscar
      </button>
    </SearchFormContainer>
  );
}

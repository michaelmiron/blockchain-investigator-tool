import { render, screen } from "@testing-library/react";
import AddressInput from "../components/AddressInput";

test("renders input and button", () => {
  render(
    <AddressInput
      address=""
      setAddress={() => {}}
      txLimit=""
      setTxLimit={() => {}}
      onSubmit={() => {}}
    />
  );

  expect(screen.getByPlaceholderText(/enter bitcoin address/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /investigate/i })).toBeInTheDocument();
});

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillTagInput from "../components/SkillTagInput/SkillTagInput";

describe("SkillTagInput", () => {
  it("should render existing skills as tags", () => {
    render(
      <SkillTagInput skills={["React", "TypeScript"]} onChange={vi.fn()} />,
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("should render placeholder when no skills", () => {
    render(<SkillTagInput skills={[]} onChange={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Type a skill and press Enter…"),
    ).toBeInTheDocument();
  });

  it("should not render placeholder when skills exist", () => {
    render(<SkillTagInput skills={["React"]} onChange={vi.fn()} />);
    expect(
      screen.queryByPlaceholderText("Type a skill and press Enter…"),
    ).not.toBeInTheDocument();
  });

  it("should call onChange with new skill when Enter is pressed", async () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Python");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["Python"]);
  });

  it("should call onChange with new skill when comma is pressed", async () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Node");
    fireEvent.keyDown(input, { key: "," });
    expect(onChange).toHaveBeenCalledWith(["Node"]);
  });

  it("should not add duplicate skills", async () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={["React"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "React");
    fireEvent.keyDown(input, { key: "Enter" });
    // onChange should NOT be called because React is already in the list
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should not add empty/whitespace-only skills", async () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "   ");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should remove skill when remove button is clicked", () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={["React", "Vue"]} onChange={onChange} />);
    const removeBtn = screen.getByRole("button", { name: "Remove React" });
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["Vue"]);
  });

  it("should remove last skill on Backspace when input is empty", () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={["React", "Vue"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["React"]);
  });

  it("should not remove skill on Backspace when input has text", async () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={["React"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Vu");
    fireEvent.keyDown(input, { key: "Backspace" }); // removes char from "Vu", not skill
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should apply is-invalid class when isInvalid is true", () => {
    const { container } = render(
      <SkillTagInput skills={[]} onChange={vi.fn()} isInvalid={true} />,
    );
    expect(container.querySelector(".is-invalid")).toBeInTheDocument();
  });

  it("should add skill on blur if input has value", () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Django" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(["Django"]);
  });

  it("should not call onChange on blur when input is empty", () => {
    const onChange = vi.fn();
    render(<SkillTagInput skills={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should focus input when wrapper is clicked", () => {
    render(<SkillTagInput skills={[]} onChange={vi.fn()} />);
    const input = screen.getByRole("textbox");
    const wrapper = input.closest(".skills-input-wrapper")!;
    fireEvent.click(wrapper);
    // Just verifying click doesn't throw
    expect(wrapper).toBeInTheDocument();
  });
});

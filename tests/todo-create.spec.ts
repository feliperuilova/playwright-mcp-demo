import { test, expect } from "@playwright/test";

const appUrl = "https://todo-app.tallinn-learning.ee/#/";

async function addTodo(page: import("@playwright/test").Page, title: string) {
  const todoInput = page.getByPlaceholder("What needs to be done?");
  await todoInput.fill(title);
  await todoInput.press("Enter");
  return page.getByTestId("todo-item").filter({ hasText: title });
}

test("creates a todo item", async ({ page }) => {
  await page.goto(appUrl);

  const todoInput = page.getByPlaceholder("What needs to be done?");
  await todoInput.fill("Buy groceries");
  await todoInput.press("Enter");

  await expect(page.getByText("Buy groceries", { exact: true })).toBeVisible();
  await expect(page.getByText("1 item left!", { exact: true })).toBeVisible();
});

test("completes and reopens a todo item", async ({ page }) => {
  await page.goto(appUrl);
  const todo = await addTodo(page, "Walk the dog");
  const checkbox = todo.getByTestId("todo-item-toggle");

  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(page.getByText("0 items left!", { exact: true })).toBeVisible();

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  await expect(page.getByText("1 item left!", { exact: true })).toBeVisible();
});

test("edits a todo item", async ({ page }) => {
  await page.goto(appUrl);
  const todo = await addTodo(page, "Old task title");

  await todo.getByText("Old task title", { exact: true }).dblclick();

  const editInput = page.getByTestId("todo-item").getByTestId("text-input");
  await expect(editInput).toBeVisible();

  await editInput.fill("Updated task title");
  await editInput.press("Enter");

  await expect(
    page.getByText("Updated task title", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Old task title", { exact: true })).toHaveCount(
    0,
  );
});

test("deletes a todo item", async ({ page }) => {
  await page.goto(appUrl);
  const todo = await addTodo(page, "Task to remove");

  await todo.hover();
  await todo.getByTestId("todo-item-button").click();

  await expect(page.getByTestId("todo-item")).toHaveCount(0);
  await expect(page.getByText("0 items left!", { exact: true })).toHaveCount(0);
});

test("filters active todo items", async ({ page }) => {
  await page.goto(appUrl);
  const activeTodo = await addTodo(page, "Active task");
  const completedTodo = await addTodo(page, "Completed task");
  await completedTodo.getByTestId("todo-item-toggle").check();

  await page.getByRole("link", { name: "Active" }).click();

  await expect(page).toHaveURL(/#\/active$/);
  await expect(activeTodo).toBeVisible();
  await expect(completedTodo).toHaveCount(0);
});

test("filters completed todo items", async ({ page }) => {
  await page.goto(appUrl);
  const completedTodo = await addTodo(page, "Completed task");
  await completedTodo.getByTestId("todo-item-toggle").check();
  await addTodo(page, "Active task");

  await page.getByRole("link", { name: "Completed" }).click();

  await expect(page).toHaveURL(/#\/completed$/);
  await expect(completedTodo).toBeVisible();
  await expect(page.getByTestId("todo-item")).toHaveCount(1);
});

test("shows all todo items after selecting All", async ({ page }) => {
  await page.goto(appUrl);
  const completedTodo = await addTodo(page, "Completed task");
  await completedTodo.getByTestId("todo-item-toggle").check();
  const activeTodo = await addTodo(page, "Active task");

  await page.getByRole("link", { name: "Completed" }).click();
  await expect(page.getByTestId("todo-item")).toHaveCount(1);
  await page.getByRole("link", { name: "All" }).click();

  await expect(page).toHaveURL(/#\/$/);
  await expect(completedTodo).toBeVisible();
  await expect(activeTodo).toBeVisible();
  await expect(page.getByTestId("todo-item")).toHaveCount(2);
});

test("toggles all todo items together", async ({ page }) => {
  await page.goto(appUrl);
  const firstTodo = await addTodo(page, "First task");
  const secondTodo = await addTodo(page, "Second task");
  const toggleAll = page.locator('main input[type="checkbox"]').first();

  await toggleAll.check();
  await expect(firstTodo.getByTestId("todo-item-toggle")).toBeChecked();
  await expect(secondTodo.getByTestId("todo-item-toggle")).toBeChecked();
  await expect(page.getByText("0 items left!", { exact: true })).toBeVisible();

  await toggleAll.uncheck();
  await expect(firstTodo.getByTestId("todo-item-toggle")).not.toBeChecked();
  await expect(secondTodo.getByTestId("todo-item-toggle")).not.toBeChecked();
  await expect(page.getByText("2 items left!", { exact: true })).toBeVisible();
});

test("clears completed todo items", async ({ page }) => {
  await page.goto(appUrl);
  const completedTodo = await addTodo(page, "Completed task");
  await completedTodo.getByTestId("todo-item-toggle").check();
  const activeTodo = await addTodo(page, "Active task");

  await page.getByRole("button", { name: "Clear completed" }).click();

  await expect(completedTodo).toHaveCount(0);
  await expect(activeTodo).toBeVisible();
  await expect(page.getByText("1 item left!", { exact: true })).toBeVisible();
});

test("updates the remaining count when tasks are added, completed, and deleted", async ({
  page,
}) => {
  await page.goto(appUrl);
  const firstTodo = await addTodo(page, "First task");
  await expect(page.getByText("1 item left!", { exact: true })).toBeVisible();

  const secondTodo = await addTodo(page, "Second task");
  await expect(page.getByText("2 items left!", { exact: true })).toBeVisible();

  await firstTodo.getByTestId("todo-item-toggle").check();
  await expect(page.getByText("1 item left!", { exact: true })).toBeVisible();

  await secondTodo.hover();
  await secondTodo.getByTestId("todo-item-button").click();
  await expect(page.getByText("0 items left!", { exact: true })).toBeVisible();
});

# Nutri-Plan

Nutri-Plan is a comprehensive web application designed to empower users in creating, managing, and tracking their personalized nutrition plans. It features a robust admin dashboard for detailed management of food data, including nutritional information, categories, and serving units. The client-side application provides intuitive tools for users to build and monitor their dietary intake, offering a complete solution for personal nutrition management.

## ✨ Features

### Admin Dashboard
- **Food Management**: Admins can effortlessly add, edit, and delete food items, including detailed nutritional information (calories, protein, carbs, fats).
- **Categorization**: Organize foods into custom categories for better organization and searchability.
- **Serving Units**: Define and manage various serving units (e.g., grams, cups, pieces) for accurate portion tracking and nutritional calculations.
- **User Roles**: Supports distinct user roles (Admin, User) to manage access permissions and functionalities within the application.

### Client Application
- **Meal Creation & Management**: Users can easily create, edit, and delete meals for specific dates, allowing for flexible meal planning.
- **Food Item Customization**: Add multiple food items to each meal, specifying precise amounts and selecting appropriate serving units.
- **Nutritional Overview**: Automatically calculates and displays total calories, protein, carbohydrates, and fats for each meal, providing immediate insights into dietary intake.
- **Date-based Filtering**: Filter and view meals by date, enabling users to track their nutrition over time and review past dietary habits.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) or any other package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nutri-plan.git
   cd nutri-plan
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root of the project and adding the following:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
4. Apply database migrations:
   ```bash
   npm run db:migrate
   ```
5. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

### Running the Application

Now you can run the development server:

```bash
npm run dev
```
*(Note: The `dev` script uses `--turbopack` for faster development builds.)*

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode with Turbopack for faster builds.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors and style issues.
- `npm run test`: Runs the test suite.
- `npm run coverage`: Generates a test coverage report.
- `npm run db:migrate`: Applies database migrations.
- `npm run db:pull`: Pulls the database schema from the database.
- `npm run db:generate`: Generates the Prisma client.
- `npm run db:studio`: Opens the Prisma Studio to view and edit data.
- `npm run db:seed`: Seeds the database with initial data. *(Note: This script uses `tsx` to execute the seed file.)*

## 🛠️ Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [SQLite](https://www.sqlite.org/index.html)
- **Authentication**: [better-auth.js](https://www.better-auth.com/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)

## Authors

* **Davi Pereira**



> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   > On `npm` some included packages can cause peer-deps issue with React 18 while installing.
   >
   > Use the `--legacy-peer-deps` flag, at the end of the installation command, as a workaround for that.

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

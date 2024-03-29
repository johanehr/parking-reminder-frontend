# Parking Reminder App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Make sure to set up the proper environment variables, based on `.env.local.example` and save as `.env.local`.

First, run the development server:

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Testing
This project has unit tests that can be run with `npm run test`.

## Linting
Run `npm run lint` to lint the project.

### Deploying on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This method was used, together with a CNAME set up for my domain on AWS Route 53.

On each pull request, Vercel will deploy a preview of the site. Use this as a sanity check that nothing has broken.

## Contributing
New features, bugs, etc should be added to the project's project board.
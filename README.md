## Getting Started

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

1. Fork the repo
2. Fill in environment variables in `.env.local` file
3. Sign up for the Alchemy and n.xyz accounts and fill in the relevant variables in your `.env.local` file.

Install

```bash
npm install

yarn

pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment Variables

You will need to fill in the env variables in your `.env.local` file for local development with the `env.example` file. Tokenbound related variables have been filled however you will need to get sign up for accounts for Alchemy and n.xyz.

We rely on [Alchemy](https://dashboard.alchemy.com/) to help with indexing NFT information, and [n.xyz](https://app.n.xyz/) for contract approval statuses. You will need to create an account with both and fill in the relevant variables in your `.env.local` file.

For `n.xyz` make sure you set the `CORS` setting to your local development address or to `*` all addresses.

`PROVIDER_ENDPOINT` can be the same as your `ALCHEMY_KEY` just use the `https` link instead.

## Getting your NFT artwork to show up in the iFrame.

The contract address and tokenId of you NFT collection is grabbed from the URL params `/contractAddress/tokenId`.

The image assets of your collection is then fetched from the `useNft` hook in `app/hooks/useNft.tsx` using the environment variable `NEXT_PUBLIC_NFT_ENDPOINT`. If you want to customize and reshape the data of from the `NEXT_PUBLIC_NFT_ENDPOINT` endpoint then make those edits inside the `getNftAssets` in `/lib/utils/nft.ts`. You can see commented out code on how you would return image from an the Azuki metadata server there for reference.

The image render will in the page.tsx file will then be expecting an array of images. If you have one image that should work just fine as well.

## Learn More

To learn more about Tokenbound, take a look at the following resources:

- [Tokenbound Documentation](https://docs.tokenbound.org/)
- [Learn tokenbound](https://tokenbound.org/)
- [EIP-6551](https://eips.ethereum.org/EIPS/eip-6551)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/huynhr"><img src="https://avatars.githubusercontent.com/u/11905306?v=4?s=100" width="100px;" alt="Raymond Huynh"/><br /><sub><b>Raymond Huynh</b></sub></a><br /><a href="https://github.com/tokenbound/iframe/commits?author=huynhr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DruzyDowns"><img src="https://avatars.githubusercontent.com/u/33797136?v=4?s=100" width="100px;" alt="Druzy Downs"/><br /><sub><b>Druzy Downs</b></sub></a><br /><a href="https://github.com/tokenbound/iframe/commits?author=DruzyDowns" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SweetmanTech"><img src="https://avatars.githubusercontent.com/u/23249402?v=4" width="100px;" alt="Druzy Downs"/><br /><sub><b>SweetmanTech.eth</b></sub></a><br /><a href="https://github.com/tokenbound/iframe/commits?author=SweetmanTech" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gandarufu"><img src="https://avatars.githubusercontent.com/u/30931613?v=4" width="100px;" alt="gandarufu"/><br /><sub><b>gandarufu</b></sub></a><br /><a href="https://github.com/tokenbound/iframe/commits?author=gandarufu" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

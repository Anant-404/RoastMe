import NextAuth, { AuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Define authentication options
export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        // These scopes allow you to read their private listening history
        // show_dialog forces Spotify to show the account switcher so users can pick a different profile
        params: {
          scope: "user-read-recently-played user-top-read",
          show_dialog: true,
        },
      },
    }),
  ],
  callbacks: {
    // 1. When Spotify returns the token, save it to the JWT (JSON Web Token)
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // 2. When the frontend asks for the session, give them the token from the JWT
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

// Create the handler
const handler = NextAuth(authOptions);

// Export it for GET and POST requests
export { handler as GET, handler as POST };

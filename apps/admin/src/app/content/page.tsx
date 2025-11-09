import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

const Page = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="font-bold text-3xl tracking-tight">Content Management</h1>
      <p className="text-muted-foreground">
        Manage website content, announcements, and user-facing information.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/content/announcements" className="group">
        <Card className="h-full transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Announcements</CardTitle>
            </div>
            <CardDescription>
              Manage site-wide announcements displayed to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Create, edit, and schedule announcements that appear on the main
              website.
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Future content management items can be added here */}
      <Card className="h-full opacity-50">
        <CardHeader>
          <CardTitle className="text-lg">Blog Posts</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Manage blog content and articles.
          </p>
        </CardContent>
      </Card>

      <Card className="h-full opacity-50">
        <CardHeader>
          <CardTitle className="text-lg">Banners</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Manage promotional banners and notices.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Page;

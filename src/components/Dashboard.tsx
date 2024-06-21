import History from "./History";
import { CircleUser, Menu, Club, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Rules from "./Rules";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard = ({ children }: DashboardProps) => {
  const { user, accountBalance, signOut } = useAuth();
  const { t } = useTranslation();

  const englishSwitch = () => {
    i18n.changeLanguage("en");
  };
  const frenchSwitch = () => {
    i18n.changeLanguage("fr");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[100px_1fr] lg:grid-cols-[200px_1fr]">
      <div className="hidden bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Club className="h-6 w-6 mr-2" />
            <span className="font-bold">Check Game</span>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {user && (
                <h2 className="font-bold text-lg mb-2">
                  {accountBalance} FCFA
                </h2>
              )}
              {/* <History /> */}
              <Rules />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="mt-5">
                  {user && (
                    <h2 className="font-bold text-lg mb-2">
                      {accountBalance} FCFA
                    </h2>
                  )}
                  <History />
                  <Rules />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="mx-[-0.65rem] flex items-center gap-4 px-3 py-2 text-muted-foreground hover:text-foreground">
                        {t("language")}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={englishSwitch}
                        className="cursor-pointer"
                      >
                        {t("english")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={frenchSwitch}
                        className="cursor-pointer"
                      >
                        {t("french")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search game history..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("my_account")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t("settings")}</DropdownMenuItem>
                <DropdownMenuItem>{t("support")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="rounded-lg">
              <Link to={"/login"}>{t("login")}</Link>
            </Button>
          )}
        </header>
        <main className="flex flex-1 border shadow-lg board">
          <div className="flex flex-1 flex-col gap-4 items-center justify-around">
            {children ? children : <Outlet />}{" "}
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;

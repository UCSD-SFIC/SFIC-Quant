import React from "react";
import { Helmet } from "react-helmet";
import HoldingsTable from "../components/holdings-table";

import TopBar from "../components/topbar";

export default function Holdings() {
  return (
    <>
      <Helmet>
        <title>Current Holdings</title>
      </Helmet>
      <div title="Current Holdings">
        <TopBar />
        <HoldingsTable />
      </div>
    </>
  );
}

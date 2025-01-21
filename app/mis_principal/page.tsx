"use client"

import React from "react";
import Layout from '../../app/components/ui/Layout';
import { get } from "lodash";
import HorizontalNavbar from "../components/ui/navigation_bar/principal_nav";

const Home = () => {

  return (
    <Layout moduleType="principal">
      <HorizontalNavbar />
        <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Principal Home</h1>
        </div>
    </Layout>

  );
};

export default Home;
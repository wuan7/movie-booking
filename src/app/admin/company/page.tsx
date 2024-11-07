"use client"

import { AddCompany } from "./add-company";
import { CompanyList } from "./company-list";

const CompanyPage = () => {
    return (
        <div>
            <AddCompany />
            <br />
            <CompanyList />
        </div>
    )
}

export default CompanyPage;
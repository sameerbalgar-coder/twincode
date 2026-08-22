module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/payroll/[employeeId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2f$payroll$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/admin/payroll-helpers.ts [app-route] (ecmascript)");
;
;
;
async function GET(request, context) {
    try {
        const { employeeId } = await context.params;
        const employee = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmployeeById"])(employeeId);
        if (!employee) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: `Employee with ID ${employeeId} not found`
            }, {
                status: 404
            });
        }
        const baseWage = employee.salaryStructure?.annualBaseSalary ? Math.round(employee.salaryStructure.annualBaseSalary / 12) : 120000;
        const salaryStructure = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2f$payroll$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateSalaryBreakdown"])(baseWage, {
            basic: employee.salaryStructure?.breakdown.basicPay,
            hra: employee.salaryStructure?.breakdown.hra,
            allowances: employee.salaryStructure?.breakdown.specialAllowance,
            pfDeduction: employee.salaryStructure?.breakdown.providentFundOr401k,
            taxDeduction: employee.salaryStructure?.breakdown.taxDeduction
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                employeeId: employee.id,
                employeeName: employee.name,
                salaryStructure
            }
        });
    } catch (error) {
        console.error('Error fetching employee salary structure:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to fetch salary structure'
        }, {
            status: 500
        });
    }
}
async function PUT(request, context) {
    try {
        const { employeeId } = await context.params;
        const body = await request.json();
        // Validate inputs (e.g. no negative figures)
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2f$payroll$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSalaryStructure"])(body);
        if (!validation.isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: validation.errors.join(', ')
            }, {
                status: 400
            });
        }
        const calculated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2f$payroll$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateSalaryBreakdown"])(body.monthlyBaseWage, body);
        // Save to employee record in DB
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateEmployee"])(employeeId, {
            salary: `₹${calculated.annualCTC.toLocaleString('en-IN')}`,
            salaryStructure: {
                annualBaseSalary: calculated.annualCTC,
                currency: '₹',
                payFrequency: 'Monthly',
                breakdown: {
                    basicPay: calculated.basic,
                    hra: calculated.hra,
                    specialAllowance: calculated.allowances,
                    performanceBonus: 0,
                    providentFundOr401k: calculated.pfDeduction,
                    taxDeduction: calculated.taxDeduction,
                    healthInsuranceDeduction: calculated.healthInsurance || 1500,
                    netMonthlySalary: calculated.netTakeHome
                },
                bankDetails: calculated.bankDetails ? {
                    bankName: calculated.bankDetails.bankName,
                    accountNumber: calculated.bankDetails.accountNumber,
                    routingOrIfsc: calculated.bankDetails.ifscCode,
                    accountType: calculated.bankDetails.accountType
                } : {
                    bankName: 'HDFC Bank Ltd.',
                    accountNumber: '•••••••• 4892',
                    routingOrIfsc: 'HDFC0001234',
                    accountType: 'Savings'
                }
            }
        });
        if (!updated) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: `Employee with ID ${employeeId} not found`
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Salary structure for ${updated.name} updated successfully`,
            data: calculated
        });
    } catch (error) {
        console.error('Error updating salary structure:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Failed to update salary structure'
        }, {
            status: 500
        });
    }
}
}),
"[project]/data/mockHrmsData.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockAttendanceRecords",
    ()=>mockAttendanceRecords,
    "mockDepartmentStats",
    ()=>mockDepartmentStats,
    "mockEmployees",
    ()=>mockEmployees,
    "mockHRMetrics",
    ()=>mockHRMetrics,
    "mockLeaveRequests",
    ()=>mockLeaveRequests
]);
const mockEmployees = [
    {
        id: 'EMP-1001',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'Principal Frontend Architect',
        department: 'Engineering',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: '2022-03-15',
        salary: '$145,000',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA (HQ)',
        leaveBalance: {
            casual: {
                total: 12,
                used: 3
            },
            sick: {
                total: 10,
                used: 2
            },
            paid: {
                total: 20,
                used: 6
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '08:52 AM',
            status: 'On-Time'
        },
        directReportsCount: 4,
        managerName: 'Alex Rivera',
        skills: [
            'Next.js',
            'React',
            'TypeScript',
            'Tailwind CSS',
            'GraphQL',
            'Web Architecture'
        ],
        personalData: {
            dateOfBirth: '1992-06-18',
            gender: 'Female',
            maritalStatus: 'Married',
            bloodGroup: 'O+',
            nationality: 'United States',
            residentialAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
            emergencyContact: {
                name: 'Michael Jenkins',
                relationship: 'Spouse',
                phone: '+1 (555) 987-6543',
                email: 'michael.j@gmail.com'
            }
        },
        salaryStructure: {
            annualBaseSalary: 145000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 6041,
                hra: 3020,
                specialAllowance: 1812,
                performanceBonus: 1208,
                providentFundOr401k: 725,
                taxDeduction: 1812,
                healthInsuranceDeduction: 350,
                netMonthlySalary: 9194
            },
            bankDetails: {
                bankName: 'JPMorgan Chase Bank, N.A.',
                accountNumber: '•••••••• 4892',
                routingOrIfsc: '021000021',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-101',
                name: 'Signed_Employment_Agreement_Sarah_Jenkins.pdf',
                type: 'Employment Contract',
                fileSize: '1.8 MB',
                uploadDate: '2022-03-10',
                status: 'Verified'
            },
            {
                id: 'DOC-102',
                name: 'Passport_Copy_Verified.pdf',
                type: 'Identity Proof / Passport',
                fileSize: '3.4 MB',
                uploadDate: '2022-03-12',
                status: 'Verified'
            },
            {
                id: 'DOC-103',
                name: 'Federal_W4_Tax_Withholding_2026.pdf',
                type: 'Tax Document (W-4 / Form 16)',
                fileSize: '620 KB',
                uploadDate: '2026-01-05',
                status: 'Verified'
            },
            {
                id: 'DOC-104',
                name: 'BS_Computer_Science_Stanford_Degree.pdf',
                type: 'Educational Degree',
                fileSize: '4.1 MB',
                uploadDate: '2022-03-11',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1002',
        name: 'David Chen',
        email: 'david.chen@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Product Designer',
        department: 'UI/UX Design',
        employmentType: 'Full-time',
        status: 'Remote',
        joinDate: '2021-11-01',
        salary: '$130,000',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX (Remote)',
        leaveBalance: {
            casual: {
                total: 12,
                used: 5
            },
            sick: {
                total: 10,
                used: 1
            },
            paid: {
                total: 20,
                used: 11
            },
            emergency: {
                total: 5,
                used: 1
            }
        },
        attendanceToday: {
            checkIn: '09:05 AM',
            status: 'On-Time'
        },
        directReportsCount: 2,
        managerName: 'Elena Rostova',
        skills: [
            'Figma',
            'Design Systems',
            'UX Research',
            'Prototyping',
            'Design Tokens'
        ],
        personalData: {
            dateOfBirth: '1990-11-24',
            gender: 'Male',
            maritalStatus: 'Single',
            bloodGroup: 'A+',
            nationality: 'United States',
            residentialAddress: '1204 South Congress Ave, Austin, TX 78704',
            emergencyContact: {
                name: 'Linda Chen',
                relationship: 'Mother',
                phone: '+1 (555) 432-1098'
            }
        },
        salaryStructure: {
            annualBaseSalary: 130000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 5416,
                hra: 2708,
                specialAllowance: 1625,
                performanceBonus: 1083,
                providentFundOr401k: 650,
                taxDeduction: 1625,
                healthInsuranceDeduction: 320,
                netMonthlySalary: 8237
            },
            bankDetails: {
                bankName: 'Bank of America, N.A.',
                accountNumber: '•••••••• 7719',
                routingOrIfsc: '111000012',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-201',
                name: 'Dayflow_Offer_Letter_David_Chen.pdf',
                type: 'Offer Letter',
                fileSize: '890 KB',
                uploadDate: '2021-10-20',
                status: 'Verified'
            },
            {
                id: 'DOC-202',
                name: 'NDA_Confidentiality_Agreement.pdf',
                type: 'Non-Disclosure Agreement (NDA)',
                fileSize: '1.2 MB',
                uploadDate: '2021-10-25',
                status: 'Verified'
            },
            {
                id: 'DOC-203',
                name: 'State_ID_Texas_Verified.pdf',
                type: 'Identity Proof / Passport',
                fileSize: '2.1 MB',
                uploadDate: '2021-10-28',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1003',
        name: 'Amara Okafor',
        email: 'amara.okafor@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Director of People Operations',
        department: 'People Operations',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: '2020-08-10',
        salary: '$150,000',
        phone: '+1 (555) 456-7890',
        location: 'San Francisco, CA (HQ)',
        leaveBalance: {
            casual: {
                total: 12,
                used: 2
            },
            sick: {
                total: 10,
                used: 0
            },
            paid: {
                total: 22,
                used: 5
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '08:40 AM',
            status: 'On-Time'
        },
        directReportsCount: 6,
        managerName: 'CEO Office',
        skills: [
            'Talent Strategy',
            'HR Compliance',
            'Employee Relations',
            'Org Development',
            'Payroll'
        ],
        personalData: {
            dateOfBirth: '1988-04-12',
            gender: 'Female',
            maritalStatus: 'Married',
            bloodGroup: 'B+',
            nationality: 'United States',
            residentialAddress: '350 Mission St, Apt 18B, San Francisco, CA 94105',
            emergencyContact: {
                name: 'Emeka Okafor',
                relationship: 'Spouse',
                phone: '+1 (555) 876-5432'
            }
        },
        salaryStructure: {
            annualBaseSalary: 150000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 6250,
                hra: 3125,
                specialAllowance: 1875,
                performanceBonus: 1250,
                providentFundOr401k: 750,
                taxDeduction: 1875,
                healthInsuranceDeduction: 350,
                netMonthlySalary: 9525
            },
            bankDetails: {
                bankName: 'Wells Fargo Bank, N.A.',
                accountNumber: '•••••••• 9012',
                routingOrIfsc: '121000247',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-301',
                name: 'Executive_Employment_Agreement.pdf',
                type: 'Employment Contract',
                fileSize: '2.5 MB',
                uploadDate: '2020-08-01',
                status: 'Verified'
            },
            {
                id: 'DOC-302',
                name: 'Passport_US_Amara_Okafor.pdf',
                type: 'Identity Proof / Passport',
                fileSize: '3.1 MB',
                uploadDate: '2020-08-02',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1004',
        name: 'Marcus Vance',
        email: 'marcus.vance@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Senior Backend Engineer',
        department: 'Engineering',
        employmentType: 'Full-time',
        status: 'On Leave',
        joinDate: '2023-01-20',
        salary: '$138,000',
        phone: '+1 (555) 567-8901',
        location: 'Seattle, WA',
        leaveBalance: {
            casual: {
                total: 12,
                used: 7
            },
            sick: {
                total: 10,
                used: 4
            },
            paid: {
                total: 18,
                used: 9
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            status: 'Absent'
        },
        directReportsCount: 0,
        managerName: 'Alex Rivera',
        skills: [
            'Go',
            'PostgreSQL',
            'Docker',
            'Kubernetes',
            'Microservices',
            'Redis'
        ],
        personalData: {
            dateOfBirth: '1993-08-30',
            gender: 'Male',
            maritalStatus: 'Single',
            bloodGroup: 'AB+',
            nationality: 'United States',
            residentialAddress: '2201 Westlake Ave, Seattle, WA 98121',
            emergencyContact: {
                name: 'David Vance',
                relationship: 'Brother',
                phone: '+1 (555) 765-4321'
            }
        },
        salaryStructure: {
            annualBaseSalary: 138000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 5750,
                hra: 2875,
                specialAllowance: 1725,
                performanceBonus: 1150,
                providentFundOr401k: 690,
                taxDeduction: 1725,
                healthInsuranceDeduction: 330,
                netMonthlySalary: 8755
            },
            bankDetails: {
                bankName: 'Citibank, N.A.',
                accountNumber: '•••••••• 3341',
                routingOrIfsc: '021000089',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-401',
                name: 'Marcus_Vance_Contract_Signed.pdf',
                type: 'Employment Contract',
                fileSize: '1.9 MB',
                uploadDate: '2023-01-15',
                status: 'Verified'
            },
            {
                id: 'DOC-402',
                name: 'W4_Tax_Document_2026.pdf',
                type: 'Tax Document (W-4 / Form 16)',
                fileSize: '580 KB',
                uploadDate: '2026-01-10',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1005',
        name: 'Elena Rostova',
        email: 'elena.rostova@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'VP of Product & Strategy',
        department: 'Product',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: '2021-04-12',
        salary: '$165,000',
        phone: '+1 (555) 678-9012',
        location: 'San Francisco, CA (HQ)',
        leaveBalance: {
            casual: {
                total: 12,
                used: 4
            },
            sick: {
                total: 10,
                used: 1
            },
            paid: {
                total: 22,
                used: 8
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '08:50 AM',
            status: 'On-Time'
        },
        directReportsCount: 8,
        managerName: 'CEO Office',
        skills: [
            'Roadmapping',
            'Agile Leadership',
            'Market Analysis',
            'SaaS Growth',
            'Product Strategy'
        ],
        personalData: {
            dateOfBirth: '1987-03-14',
            gender: 'Female',
            maritalStatus: 'Married',
            bloodGroup: 'O-',
            nationality: 'United States',
            residentialAddress: '500 Howard St, San Francisco, CA 94105',
            emergencyContact: {
                name: 'Dmitri Rostov',
                relationship: 'Spouse',
                phone: '+1 (555) 654-3210'
            }
        },
        salaryStructure: {
            annualBaseSalary: 165000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 6875,
                hra: 3437,
                specialAllowance: 2062,
                performanceBonus: 1375,
                providentFundOr401k: 825,
                taxDeduction: 2062,
                healthInsuranceDeduction: 380,
                netMonthlySalary: 10482
            },
            bankDetails: {
                bankName: 'Silicon Valley Bank / First Citizens',
                accountNumber: '•••••••• 8820',
                routingOrIfsc: '121140399',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-501',
                name: 'Executive_Product_VP_Contract.pdf',
                type: 'Employment Contract',
                fileSize: '2.8 MB',
                uploadDate: '2021-04-05',
                status: 'Verified'
            },
            {
                id: 'DOC-502',
                name: 'MBA_Harvard_Business_School.pdf',
                type: 'Educational Degree',
                fileSize: '3.6 MB',
                uploadDate: '2021-04-08',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1006',
        name: 'Kavita Patel',
        email: 'kavita.patel@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        role: 'Senior Financial Analyst',
        department: 'Finance',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: '2022-09-01',
        salary: '$118,000',
        phone: '+1 (555) 789-0123',
        location: 'New York, NY',
        leaveBalance: {
            casual: {
                total: 12,
                used: 3
            },
            sick: {
                total: 10,
                used: 1
            },
            paid: {
                total: 18,
                used: 4
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '09:42 AM',
            status: 'Late'
        },
        directReportsCount: 1,
        managerName: 'Jonathan Hayes',
        skills: [
            'Financial Modeling',
            'Budgeting',
            'QuickBooks',
            'Excel Macros',
            'Forecasting'
        ],
        personalData: {
            dateOfBirth: '1994-09-19',
            gender: 'Female',
            maritalStatus: 'Single',
            bloodGroup: 'B+',
            nationality: 'United States',
            residentialAddress: '450 Lexington Ave, New York, NY 10017',
            emergencyContact: {
                name: 'Rajesh Patel',
                relationship: 'Father',
                phone: '+1 (555) 543-2109'
            }
        },
        salaryStructure: {
            annualBaseSalary: 118000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 4916,
                hra: 2458,
                specialAllowance: 1475,
                performanceBonus: 983,
                providentFundOr401k: 590,
                taxDeduction: 1475,
                healthInsuranceDeduction: 300,
                netMonthlySalary: 7467
            },
            bankDetails: {
                bankName: 'Chase Bank NY Branch',
                accountNumber: '•••••••• 6124',
                routingOrIfsc: '021000021',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-601',
                name: 'CPA_Certificate_Kavita_Patel.pdf',
                type: 'Educational Degree',
                fileSize: '2.2 MB',
                uploadDate: '2022-08-25',
                status: 'Verified'
            },
            {
                id: 'DOC-602',
                name: 'Background_Check_Report_Approved.pdf',
                type: 'Background Verification',
                fileSize: '1.4 MB',
                uploadDate: '2022-08-28',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1007',
        name: 'Lucas Morales',
        email: 'lucas.morales@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        role: 'Enterprise Account Executive',
        department: 'Sales & Marketing',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: '2023-06-15',
        salary: '$110,000 + OTE',
        phone: '+1 (555) 890-1234',
        location: 'Chicago, IL',
        leaveBalance: {
            casual: {
                total: 12,
                used: 1
            },
            sick: {
                total: 10,
                used: 0
            },
            paid: {
                total: 15,
                used: 2
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '09:02 AM',
            status: 'On-Time'
        },
        directReportsCount: 0,
        managerName: 'Rachel Green',
        skills: [
            'HubSpot CRM',
            'B2B Sales',
            'Contract Negotiation',
            'Lead Qualification',
            'Enterprise SaaS'
        ],
        personalData: {
            dateOfBirth: '1991-12-05',
            gender: 'Male',
            maritalStatus: 'Married',
            bloodGroup: 'O+',
            nationality: 'United States',
            residentialAddress: '233 S Wacker Dr, Chicago, IL 60606',
            emergencyContact: {
                name: 'Sofia Morales',
                relationship: 'Spouse',
                phone: '+1 (555) 432-1000'
            }
        },
        salaryStructure: {
            annualBaseSalary: 110000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 4583,
                hra: 2291,
                specialAllowance: 1375,
                performanceBonus: 1833,
                providentFundOr401k: 550,
                taxDeduction: 1375,
                healthInsuranceDeduction: 310,
                netMonthlySalary: 7847
            },
            bankDetails: {
                bankName: 'PNC Bank, National Association',
                accountNumber: '•••••••• 9941',
                routingOrIfsc: '071921891',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-701',
                name: 'Sales_Commission_Structure_Agreement.pdf',
                type: 'Employment Contract',
                fileSize: '1.1 MB',
                uploadDate: '2023-06-10',
                status: 'Verified'
            }
        ]
    },
    {
        id: 'EMP-1008',
        name: 'Zoe Katsaros',
        email: 'zoe.katsaros@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        role: 'Junior DevOps Engineer',
        department: 'Engineering',
        employmentType: 'Contract',
        status: 'Probation',
        joinDate: '2024-05-10',
        salary: '$92,000',
        phone: '+1 (555) 901-2345',
        location: 'San Francisco, CA (HQ)',
        leaveBalance: {
            casual: {
                total: 6,
                used: 0
            },
            sick: {
                total: 5,
                used: 0
            },
            paid: {
                total: 10,
                used: 0
            },
            emergency: {
                total: 3,
                used: 0
            }
        },
        attendanceToday: {
            checkIn: '08:35 AM',
            status: 'On-Time'
        },
        directReportsCount: 0,
        managerName: 'Sarah Jenkins',
        skills: [
            'AWS',
            'Terraform',
            'CI/CD Pipelines',
            'Linux',
            'Bash',
            'Docker'
        ],
        personalData: {
            dateOfBirth: '1998-02-28',
            gender: 'Female',
            maritalStatus: 'Single',
            bloodGroup: 'A-',
            nationality: 'United States',
            residentialAddress: '100 Van Ness Ave, San Francisco, CA 94102',
            emergencyContact: {
                name: 'George Katsaros',
                relationship: 'Father',
                phone: '+1 (555) 321-0987'
            }
        },
        salaryStructure: {
            annualBaseSalary: 92000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 3833,
                hra: 1916,
                specialAllowance: 1150,
                performanceBonus: 766,
                providentFundOr401k: 460,
                taxDeduction: 1150,
                healthInsuranceDeduction: 280,
                netMonthlySalary: 5775
            },
            bankDetails: {
                bankName: 'Capital One, N.A.',
                accountNumber: '•••••••• 2155',
                routingOrIfsc: '051405515',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-801',
                name: 'Offer_Letter_Zoe_Katsaros_Probation.pdf',
                type: 'Offer Letter',
                fileSize: '750 KB',
                uploadDate: '2024-05-01',
                status: 'Verified'
            },
            {
                id: 'DOC-802',
                name: 'Degree_Certificate_UC_Berkeley.pdf',
                type: 'Educational Degree',
                fileSize: '3.8 MB',
                uploadDate: '2024-05-05',
                status: 'Pending Review'
            }
        ]
    },
    {
        id: 'EMP-1009',
        name: 'Tariq Mansoor',
        email: 'tariq.mansoor@dayflow.io',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        role: 'Customer Success Manager',
        department: 'Customer Success',
        employmentType: 'Full-time',
        status: 'Remote',
        joinDate: '2022-07-18',
        salary: '$102,000',
        phone: '+1 (555) 012-3456',
        location: 'Denver, CO (Remote)',
        leaveBalance: {
            casual: {
                total: 12,
                used: 6
            },
            sick: {
                total: 10,
                used: 3
            },
            paid: {
                total: 18,
                used: 8
            },
            emergency: {
                total: 5,
                used: 1
            }
        },
        attendanceToday: {
            checkIn: '08:58 AM',
            status: 'On-Time'
        },
        directReportsCount: 3,
        managerName: 'Elena Rostova',
        skills: [
            'Zendesk',
            'Client Retention',
            'Onboarding',
            'Customer Health Metrics',
            'Intercom'
        ],
        personalData: {
            dateOfBirth: '1991-07-04',
            gender: 'Male',
            maritalStatus: 'Married',
            bloodGroup: 'O+',
            nationality: 'United States',
            residentialAddress: '1700 California St, Denver, CO 80202',
            emergencyContact: {
                name: 'Fatima Mansoor',
                relationship: 'Spouse',
                phone: '+1 (555) 210-9876'
            }
        },
        salaryStructure: {
            annualBaseSalary: 102000,
            currency: '$',
            payFrequency: 'Monthly',
            breakdown: {
                basicPay: 4250,
                hra: 2125,
                specialAllowance: 1275,
                performanceBonus: 850,
                providentFundOr401k: 510,
                taxDeduction: 1275,
                healthInsuranceDeduction: 300,
                netMonthlySalary: 6415
            },
            bankDetails: {
                bankName: 'US Bank National Association',
                accountNumber: '•••••••• 5521',
                routingOrIfsc: '102000021',
                accountType: 'Checking'
            }
        },
        documents: [
            {
                id: 'DOC-901',
                name: 'Employment_Agreement_Tariq_Mansoor.pdf',
                type: 'Employment Contract',
                fileSize: '1.6 MB',
                uploadDate: '2022-07-10',
                status: 'Verified'
            }
        ]
    }
];
const mockAttendanceRecords = [
    {
        id: 'ATT-201',
        employeeId: 'EMP-1008',
        employeeName: 'Zoe Katsaros',
        employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        department: 'Engineering',
        date: 'Today, Aug 22',
        checkInTime: '08:35 AM',
        checkOutTime: '--',
        workHours: '3h 15m (Active)',
        status: 'On-Time',
        ipLocation: 'SF HQ Office (192.168.1.42)',
        device: 'MacBook Pro 16"'
    },
    {
        id: 'ATT-202',
        employeeId: 'EMP-1003',
        employeeName: 'Amara Okafor',
        employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'People Operations',
        date: 'Today, Aug 22',
        checkInTime: '08:40 AM',
        checkOutTime: '--',
        workHours: '3h 10m (Active)',
        status: 'On-Time',
        ipLocation: 'SF HQ Office (192.168.1.18)',
        device: 'MacBook Air M2'
    },
    {
        id: 'ATT-203',
        employeeId: 'EMP-1005',
        employeeName: 'Elena Rostova',
        employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        department: 'Product',
        date: 'Today, Aug 22',
        checkInTime: '08:50 AM',
        checkOutTime: '--',
        workHours: '3h 00m (Active)',
        status: 'On-Time',
        ipLocation: 'SF HQ Office (192.168.1.55)',
        device: 'Dell XPS 15'
    },
    {
        id: 'ATT-204',
        employeeId: 'EMP-1001',
        employeeName: 'Sarah Jenkins',
        employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        department: 'Engineering',
        date: 'Today, Aug 22',
        checkInTime: '08:52 AM',
        checkOutTime: '--',
        workHours: '2h 58m (Active)',
        status: 'On-Time',
        ipLocation: 'SF HQ Office (192.168.1.24)',
        device: 'MacBook Pro M3'
    },
    {
        id: 'ATT-205',
        employeeId: 'EMP-1009',
        employeeName: 'Tariq Mansoor',
        employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        department: 'Customer Success',
        date: 'Today, Aug 22',
        checkInTime: '08:58 AM',
        checkOutTime: '--',
        workHours: '2h 52m (Active)',
        status: 'Remote',
        ipLocation: 'Denver VPN (10.8.0.12)',
        device: 'ThinkPad X1 Carbon'
    },
    {
        id: 'ATT-206',
        employeeId: 'EMP-1007',
        employeeName: 'Lucas Morales',
        employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        department: 'Sales & Marketing',
        date: 'Today, Aug 22',
        checkInTime: '09:02 AM',
        checkOutTime: '--',
        workHours: '2h 48m (Active)',
        status: 'On-Time',
        ipLocation: 'Chicago Office (192.168.4.10)',
        device: 'iPad Pro 12.9" / Mac Mini'
    },
    {
        id: 'ATT-207',
        employeeId: 'EMP-1002',
        employeeName: 'David Chen',
        employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        department: 'UI/UX Design',
        date: 'Today, Aug 22',
        checkInTime: '09:05 AM',
        checkOutTime: '--',
        workHours: '2h 45m (Active)',
        status: 'Remote',
        ipLocation: 'Austin VPN (10.8.0.33)',
        device: 'Mac Studio M2 Max'
    },
    {
        id: 'ATT-208',
        employeeId: 'EMP-1006',
        employeeName: 'Kavita Patel',
        employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        department: 'Finance',
        date: 'Today, Aug 22',
        checkInTime: '09:42 AM',
        checkOutTime: '--',
        workHours: '2h 08m (Active)',
        status: 'Late',
        ipLocation: 'NYC Branch (192.168.3.15)',
        device: 'Surface Laptop 5'
    }
];
const mockLeaveRequests = [
    {
        id: 'LV-501',
        employeeId: 'EMP-1001',
        employeeName: 'Sarah Jenkins',
        employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        department: 'Engineering',
        role: 'Principal Frontend Architect',
        leaveType: 'Paid Annual Leave',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        daysCount: 5,
        reason: 'Family vacation and personal downtime after Q3 release sprint.',
        appliedDate: '2026-08-20',
        status: 'Pending',
        conflictWarning: 'Note: Marcus Vance is also scheduled off during that week'
    },
    {
        id: 'LV-502',
        employeeId: 'EMP-1002',
        employeeName: 'David Chen',
        employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        department: 'UI/UX Design',
        role: 'Lead Product Designer',
        leaveType: 'Casual Leave',
        startDate: '2026-08-25',
        endDate: '2026-08-26',
        daysCount: 2,
        reason: 'Attending Figma Config Regional Design Summit in Austin.',
        appliedDate: '2026-08-21',
        status: 'Pending'
    },
    {
        id: 'LV-503',
        employeeId: 'EMP-1006',
        employeeName: 'Kavita Patel',
        employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        department: 'Finance',
        role: 'Senior Financial Analyst',
        leaveType: 'Sick Leave',
        startDate: '2026-08-24',
        endDate: '2026-08-24',
        daysCount: 1,
        reason: 'Scheduled dental procedure and post-op recovery.',
        appliedDate: '2026-08-22',
        status: 'Pending'
    },
    {
        id: 'LV-504',
        employeeId: 'EMP-1004',
        employeeName: 'Marcus Vance',
        employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        department: 'Engineering',
        role: 'Senior Backend Engineer',
        leaveType: 'Emergency Leave',
        startDate: '2026-08-22',
        endDate: '2026-08-23',
        daysCount: 2,
        reason: 'Urgent home plumbing repair and personal matter.',
        appliedDate: '2026-08-21',
        status: 'Approved'
    },
    {
        id: 'LV-505',
        employeeId: 'EMP-1007',
        employeeName: 'Lucas Morales',
        employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        department: 'Sales & Marketing',
        role: 'Enterprise Account Executive',
        leaveType: 'Casual Leave',
        startDate: '2026-08-15',
        endDate: '2026-08-16',
        daysCount: 2,
        reason: 'Family wedding anniversary celebration.',
        appliedDate: '2026-08-10',
        status: 'Approved'
    }
];
const mockDepartmentStats = [
    {
        name: 'Engineering',
        totalEmployees: 48,
        presentToday: 45,
        onLeaveToday: 3,
        color: 'bg-indigo-500'
    },
    {
        name: 'Product',
        totalEmployees: 18,
        presentToday: 18,
        onLeaveToday: 0,
        color: 'bg-blue-500'
    },
    {
        name: 'UI/UX Design',
        totalEmployees: 14,
        presentToday: 13,
        onLeaveToday: 1,
        color: 'bg-purple-500'
    },
    {
        name: 'People Operations',
        totalEmployees: 8,
        presentToday: 8,
        onLeaveToday: 0,
        color: 'bg-emerald-500'
    },
    {
        name: 'Sales & Marketing',
        totalEmployees: 32,
        presentToday: 30,
        onLeaveToday: 2,
        color: 'bg-amber-500'
    },
    {
        name: 'Finance',
        totalEmployees: 12,
        presentToday: 11,
        onLeaveToday: 1,
        color: 'bg-rose-500'
    },
    {
        name: 'Customer Success',
        totalEmployees: 16,
        presentToday: 15,
        onLeaveToday: 1,
        color: 'bg-teal-500'
    }
];
const mockHRMetrics = {
    totalEmployees: 148,
    activeToday: 140,
    remoteToday: 34,
    onLeaveToday: 8,
    lateArrivalsToday: 3,
    pendingLeavesCount: 3,
    attendanceRate: 94.6,
    newHiresThisMonth: 6
};
}),
"[project]/lib/admin/payroll-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculatePayableDays",
    ()=>calculatePayableDays,
    "calculateProRatedPay",
    ()=>calculateProRatedPay,
    "calculateSalaryBreakdown",
    ()=>calculateSalaryBreakdown,
    "formatINR",
    ()=>formatINR,
    "validateSalaryStructure",
    ()=>validateSalaryStructure
]);
function formatINR(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
function calculateSalaryBreakdown(monthlyWage, overrides) {
    const sanitizedMonthly = Math.max(0, monthlyWage || 0);
    const annualCTC = sanitizedMonthly * 12;
    // Defaults
    const defaultBasic = Math.round(sanitizedMonthly * 0.50);
    const defaultHra = Math.round(sanitizedMonthly * 0.25);
    const defaultAllowances = Math.round(sanitizedMonthly * 0.25);
    const defaultPf = Math.round(defaultBasic * 0.12);
    const defaultTax = Math.round(sanitizedMonthly * 0.10);
    const defaultHealthInsurance = 1500;
    const basic = overrides?.basic !== undefined ? Math.max(0, overrides.basic) : defaultBasic;
    const hra = overrides?.hra !== undefined ? Math.max(0, overrides.hra) : defaultHra;
    const allowances = overrides?.allowances !== undefined ? Math.max(0, overrides.allowances) : defaultAllowances;
    const pfDeduction = overrides?.pfDeduction !== undefined ? Math.max(0, overrides.pfDeduction) : defaultPf;
    const taxDeduction = overrides?.taxDeduction !== undefined ? Math.max(0, overrides.taxDeduction) : defaultTax;
    const healthInsurance = overrides?.healthInsurance !== undefined ? Math.max(0, overrides.healthInsurance) : defaultHealthInsurance;
    const grossSalary = basic + hra + allowances;
    const totalDeductions = pfDeduction + taxDeduction + healthInsurance;
    const netTakeHome = Math.max(0, grossSalary - totalDeductions);
    return {
        monthlyBaseWage: sanitizedMonthly,
        annualCTC,
        basic,
        hra,
        allowances,
        pfDeduction,
        taxDeduction,
        healthInsurance,
        grossSalary,
        totalDeductions,
        netTakeHome,
        bankDetails: overrides?.bankDetails || {
            bankName: 'HDFC Bank Ltd.',
            accountNumber: '•••••••• 4892',
            ifscCode: 'HDFC0001234',
            accountType: 'Salary'
        }
    };
}
function calculatePayableDays(totalWorkingDays, unapprovedAbsences = 0, unpaidLeaveDays = 0) {
    const deductions = unapprovedAbsences + unpaidLeaveDays;
    return Math.max(0, Math.min(totalWorkingDays, totalWorkingDays - deductions));
}
function calculateProRatedPay(grossSalary, totalDeductions, totalWorkingDays, payableDays) {
    if (totalWorkingDays <= 0) {
        return {
            proRatedGross: grossSalary,
            proRatedDeductions: totalDeductions,
            netPay: grossSalary - totalDeductions
        };
    }
    const factor = Math.min(1, Math.max(0, payableDays / totalWorkingDays));
    const proRatedGross = Math.round(grossSalary * factor);
    // Fixed statutory deductions or pro-rated
    const proRatedDeductions = Math.round(totalDeductions * factor);
    const netPay = Math.max(0, proRatedGross - proRatedDeductions);
    return {
        proRatedGross,
        proRatedDeductions,
        netPay
    };
}
function validateSalaryStructure(config) {
    const errors = [];
    if (config.monthlyBaseWage !== undefined && config.monthlyBaseWage < 0) {
        errors.push('Monthly Base Wage cannot be negative.');
    }
    if (config.basic !== undefined && config.basic < 0) {
        errors.push('Basic pay cannot be negative.');
    }
    if (config.hra !== undefined && config.hra < 0) {
        errors.push('HRA cannot be negative.');
    }
    if (config.allowances !== undefined && config.allowances < 0) {
        errors.push('Special allowances cannot be negative.');
    }
    if (config.pfDeduction !== undefined && config.pfDeduction < 0) {
        errors.push('PF deduction cannot be negative.');
    }
    if (config.taxDeduction !== undefined && config.taxDeduction < 0) {
        errors.push('Tax / TDS deduction cannot be negative.');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "approveLeaveRequest",
    ()=>approveLeaveRequest,
    "createEmployee",
    ()=>createEmployee,
    "createLeaveRequest",
    ()=>createLeaveRequest,
    "deleteEmployee",
    ()=>deleteEmployee,
    "getAttendanceRecords",
    ()=>getAttendanceRecords,
    "getDynamicMetrics",
    ()=>getDynamicMetrics,
    "getEmployeeById",
    ()=>getEmployeeById,
    "getEmployees",
    ()=>getEmployees,
    "getLeaveRequests",
    ()=>getLeaveRequests,
    "logAttendance",
    ()=>logAttendance,
    "rejectLeaveRequest",
    ()=>rejectLeaveRequest,
    "updateEmployee",
    ()=>updateEmployee,
    "updateLeaveStatus",
    ()=>updateLeaveStatus
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/mockHrmsData.ts [app-route] (ecmascript)");
;
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.data');
const DB_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'hrms_store.json');
// Ensure directory and db file exist
function ensureDatabase() {
    try {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
                recursive: true
            });
        }
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DB_FILE)) {
            const initialData = {
                employees: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockEmployees"],
                attendanceRecords: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockAttendanceRecords"],
                leaveRequests: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockLeaveRequests"],
                lastUpdated: new Date().toISOString()
            };
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading/initializing HRMS database:', error);
        return {
            employees: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockEmployees"],
            attendanceRecords: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockAttendanceRecords"],
            leaveRequests: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mockHrmsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockLeaveRequests"],
            lastUpdated: new Date().toISOString()
        };
    }
}
// Write to database
function saveDatabase(data) {
    try {
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DATA_DIR)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(DATA_DIR, {
                recursive: true
            });
        }
        data.lastUpdated = new Date().toISOString();
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to HRMS database:', error);
    }
}
async function getEmployees(filter) {
    const db = ensureDatabase();
    let result = db.employees;
    if (filter) {
        const { search, department, status, employmentType } = filter;
        if (search) {
            const s = search.toLowerCase();
            result = result.filter((e)=>e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s) || e.role.toLowerCase().includes(s) || e.id.toLowerCase().includes(s) || e.department.toLowerCase().includes(s));
        }
        if (department && department !== 'All') {
            result = result.filter((e)=>e.department === department);
        }
        if (status && status !== 'All') {
            result = result.filter((e)=>e.status === status);
        }
        if (employmentType && employmentType !== 'All') {
            result = result.filter((e)=>e.employmentType === employmentType);
        }
    }
    return result;
}
async function getEmployeeById(id) {
    const db = ensureDatabase();
    return db.employees.find((e)=>e.id === id) || null;
}
async function createEmployee(data) {
    const db = ensureDatabase();
    const newId = data.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmployee = {
        id: newId,
        name: data.name || 'New Employee',
        email: data.email || `${newId.toLowerCase()}@dayflow.io`,
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: data.role || 'Associate',
        department: data.department || 'Engineering',
        employmentType: data.employmentType || 'Full-time',
        status: data.status || 'Active',
        joinDate: data.joinDate || new Date().toISOString().split('T')[0],
        salary: data.salary || '$120,000',
        phone: data.phone || '+1 (555) 000-0000',
        location: data.location || 'San Francisco, CA (HQ)',
        leaveBalance: data.leaveBalance || {
            casual: {
                total: 12,
                used: 0
            },
            sick: {
                total: 10,
                used: 0
            },
            paid: {
                total: 20,
                used: 0
            },
            emergency: {
                total: 5,
                used: 0
            }
        },
        attendanceToday: data.attendanceToday || {
            status: 'Absent'
        },
        directReportsCount: data.directReportsCount || 0,
        managerName: data.managerName || 'Alex Rivera',
        skills: data.skills || [
            'General'
        ],
        personalData: data.personalData,
        salaryStructure: data.salaryStructure,
        documents: data.documents || []
    };
    db.employees.unshift(newEmployee);
    saveDatabase(db);
    return newEmployee;
}
async function updateEmployee(id, updates) {
    const db = ensureDatabase();
    const index = db.employees.findIndex((e)=>e.id === id);
    if (index === -1) return null;
    db.employees[index] = {
        ...db.employees[index],
        ...updates,
        id
    };
    saveDatabase(db);
    return db.employees[index];
}
async function deleteEmployee(id) {
    const db = ensureDatabase();
    const initialCount = db.employees.length;
    db.employees = db.employees.filter((e)=>e.id !== id);
    if (db.employees.length !== initialCount) {
        saveDatabase(db);
        return true;
    }
    return false;
}
async function getAttendanceRecords(filter) {
    const db = ensureDatabase();
    const employees = db.employees;
    // Build comprehensive attendance items across all employees
    let records = employees.map((emp)=>{
        const existingLog = db.attendanceRecords.find((a)=>a.employeeId === emp.id);
        const isOnLeave = emp.status === 'On Leave';
        // Determine check-in, check-out, and status
        let checkIn = existingLog?.checkInTime || emp.attendanceToday?.checkIn || '--';
        let checkOut = existingLog?.checkOutTime || '--';
        let workHours = '8h 00m';
        let extraHours = '+0m';
        let status = 'Present';
        let statusIndicator = 'green';
        if (isOnLeave) {
            status = 'Approved Leave';
            statusIndicator = 'airplane';
            checkIn = '--';
            checkOut = '--';
            workHours = '0h';
            extraHours = '0h';
        } else if (emp.attendanceToday?.status === 'Late' || existingLog?.status === 'Late') {
            status = 'Late';
            statusIndicator = 'yellow';
            workHours = '7h 15m';
            extraHours = '0h';
            checkOut = '05:30 PM';
        } else if (emp.status === 'Remote') {
            status = 'Remote';
            statusIndicator = 'green';
            workHours = '8h 15m';
            extraHours = '+15m';
            checkOut = '05:15 PM';
        } else if (!existingLog && !emp.attendanceToday?.checkIn) {
            status = 'Absent';
            statusIndicator = 'yellow';
            checkIn = '--';
            checkOut = '--';
            workHours = '0h';
            extraHours = '0h';
        } else {
            status = 'Present';
            statusIndicator = 'green';
            checkOut = '05:30 PM';
            extraHours = '+30m';
        }
        return {
            id: existingLog?.id || `ATT-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeAvatar: emp.avatar,
            department: emp.department,
            date: existingLog?.date || 'Today, Aug 22',
            checkIn,
            checkOut,
            workHours,
            extraHours,
            status,
            statusIndicator,
            ipLocation: existingLog?.ipLocation || `${emp.location.split('(')[0].trim()} (192.168.1.20)`,
            device: existingLog?.device || 'Workstation'
        };
    });
    if (filter) {
        const { employeeId, search, department } = filter;
        if (employeeId && employeeId !== 'all') {
            records = records.filter((r)=>r.employeeId === employeeId);
        }
        if (department && department !== 'All') {
            records = records.filter((r)=>r.department === department);
        }
        if (search) {
            const s = search.toLowerCase();
            records = records.filter((r)=>r.employeeName.toLowerCase().includes(s) || r.employeeId.toLowerCase().includes(s) || r.department.toLowerCase().includes(s));
        }
    }
    return records;
}
async function logAttendance(record) {
    const db = ensureDatabase();
    const employee = db.employees.find((e)=>e.id === record.employeeId);
    const newRecord = {
        id: record.id || `ATT-${Math.floor(200 + Math.random() * 800)}`,
        employeeId: record.employeeId || 'EMP-1001',
        employeeName: record.employeeName || employee?.name || 'Staff Member',
        employeeAvatar: record.employeeAvatar || employee?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        department: record.department || employee?.department || 'Engineering',
        date: record.date || 'Today, Aug 22',
        checkInTime: record.checkInTime || new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
        checkOutTime: record.checkOutTime || '--',
        workHours: record.workHours || 'Active',
        status: record.status || 'On-Time',
        ipLocation: record.ipLocation || 'SF HQ Office (192.168.1.50)',
        device: record.device || 'Workstation'
    };
    db.attendanceRecords.unshift(newRecord);
    saveDatabase(db);
    return newRecord;
}
async function getLeaveRequests(filter) {
    const db = ensureDatabase();
    let list = db.leaveRequests.map((req)=>{
        let leaveTypeMapped = 'Paid Time Off';
        if (req.leaveType.includes('Sick')) leaveTypeMapped = 'Sick Leave';
        else if (req.leaveType.includes('Casual')) leaveTypeMapped = 'Paid Time Off';
        else if (req.leaveType.includes('Emergency')) leaveTypeMapped = 'Emergency Leave';
        else if (req.leaveType.includes('Unpaid')) leaveTypeMapped = 'Unpaid Leave';
        return {
            id: req.id,
            employeeId: req.employeeId,
            employeeName: req.employeeName,
            employeeAvatar: req.employeeAvatar,
            department: req.department,
            role: req.role,
            leaveType: leaveTypeMapped,
            validityFrom: req.startDate,
            validityTo: req.endDate,
            allocationDays: req.daysCount,
            remarks: req.reason,
            attachmentUrl: '/documents/medical_cert_sample.pdf',
            attachmentName: req.leaveType.includes('Sick') ? 'Doctor_Medical_Certificate.pdf' : 'Travel_Itinerary_Confirmation.pdf',
            status: req.status,
            conflictWarning: req.conflictWarning,
            appliedDate: req.appliedDate,
            adminRemarks: req.adminRemarks
        };
    });
    if (filter) {
        const { status, category, employeeId } = filter;
        if (status && status !== 'All') {
            list = list.filter((l)=>l.status === status);
        }
        if (category && category !== 'All') {
            list = list.filter((l)=>l.leaveType === category);
        }
        if (employeeId && employeeId !== 'all') {
            list = list.filter((l)=>l.employeeId === employeeId);
        }
    }
    return list;
}
async function createLeaveRequest(data) {
    const db = ensureDatabase();
    const employee = db.employees.find((e)=>e.id === data.employeeId);
    const newRequest = {
        id: data.id || `LV-${Math.floor(500 + Math.random() * 500)}`,
        employeeId: data.employeeId || 'EMP-1001',
        employeeName: data.employeeName || employee?.name || 'Sarah Jenkins',
        employeeAvatar: data.employeeAvatar || employee?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        department: data.department || employee?.department || 'Engineering',
        role: data.role || employee?.role || 'Engineer',
        leaveType: data.leaveType || 'Paid Annual Leave',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        daysCount: data.daysCount || 1,
        reason: data.reason || 'Personal time off',
        appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
        status: data.status || 'Pending',
        conflictWarning: data.conflictWarning,
        adminRemarks: data.adminRemarks
    };
    db.leaveRequests.unshift(newRequest);
    saveDatabase(db);
    return newRequest;
}
async function updateLeaveStatus(id, status, adminRemarks) {
    if (status === 'Approved') {
        const res = await approveLeaveRequest(id, adminRemarks);
        if (!res) return null;
        const db = ensureDatabase();
        return db.leaveRequests.find((l)=>l.id === id) || null;
    } else {
        const res = await rejectLeaveRequest(id, adminRemarks);
        if (!res) return null;
        const db = ensureDatabase();
        return db.leaveRequests.find((l)=>l.id === id) || null;
    }
}
async function approveLeaveRequest(id, adminRemarks) {
    const db = ensureDatabase();
    const index = db.leaveRequests.findIndex((l)=>l.id === id);
    if (index === -1) return null;
    const req = db.leaveRequests[index];
    req.status = 'Approved';
    if (adminRemarks) {
        req.adminRemarks = adminRemarks;
    }
    // Sync with employee's attendance & leave balance
    const empIndex = db.employees.findIndex((e)=>e.id === req.employeeId);
    if (empIndex !== -1) {
        const emp = db.employees[empIndex];
        emp.status = 'On Leave';
        emp.attendanceToday = {
            status: 'Absent'
        };
        // Deduct leave balance
        if (req.leaveType.includes('Sick') && emp.leaveBalance?.sick) {
            emp.leaveBalance.sick.used = Math.min(emp.leaveBalance.sick.total, emp.leaveBalance.sick.used + req.daysCount);
        } else if (emp.leaveBalance?.paid) {
            emp.leaveBalance.paid.used = Math.min(emp.leaveBalance.paid.total, emp.leaveBalance.paid.used + req.daysCount);
        }
    }
    saveDatabase(db);
    return {
        id: req.id,
        employeeId: req.employeeId,
        employeeName: req.employeeName,
        employeeAvatar: req.employeeAvatar,
        department: req.department,
        role: req.role,
        leaveType: req.leaveType,
        validityFrom: req.startDate,
        validityTo: req.endDate,
        allocationDays: req.daysCount,
        remarks: req.reason,
        status: 'Approved',
        appliedDate: req.appliedDate,
        adminRemarks: req.adminRemarks
    };
}
async function rejectLeaveRequest(id, adminRemarks) {
    const db = ensureDatabase();
    const index = db.leaveRequests.findIndex((l)=>l.id === id);
    if (index === -1) return null;
    const req = db.leaveRequests[index];
    req.status = 'Rejected';
    if (adminRemarks) {
        req.adminRemarks = adminRemarks;
    }
    saveDatabase(db);
    return {
        id: req.id,
        employeeId: req.employeeId,
        employeeName: req.employeeName,
        employeeAvatar: req.employeeAvatar,
        department: req.department,
        role: req.role,
        leaveType: req.leaveType,
        validityFrom: req.startDate,
        validityTo: req.endDate,
        allocationDays: req.daysCount,
        remarks: req.reason,
        status: 'Rejected',
        appliedDate: req.appliedDate,
        adminRemarks: req.adminRemarks
    };
}
async function getDynamicMetrics() {
    const db = ensureDatabase();
    const employees = db.employees;
    const leaves = db.leaveRequests;
    const attendance = db.attendanceRecords;
    const totalEmployees = employees.length;
    const activeToday = employees.filter((e)=>e.status === 'Active' || e.status === 'Remote' || e.status === 'Probation').length;
    const remoteToday = employees.filter((e)=>e.status === 'Remote').length;
    const onLeaveToday = employees.filter((e)=>e.status === 'On Leave').length;
    const lateArrivalsToday = attendance.filter((a)=>a.status === 'Late').length;
    const pendingLeavesCount = leaves.filter((l)=>l.status === 'Pending').length;
    const attendanceRate = totalEmployees > 0 ? Number((activeToday / totalEmployees * 100).toFixed(1)) : 100;
    const departments = [
        'Engineering',
        'Product',
        'UI/UX Design',
        'People Operations',
        'Sales & Marketing',
        'Finance',
        'Customer Success'
    ];
    const deptColors = {
        'Engineering': 'bg-indigo-500',
        'Product': 'bg-blue-500',
        'UI/UX Design': 'bg-purple-500',
        'People Operations': 'bg-emerald-500',
        'Sales & Marketing': 'bg-amber-500',
        'Finance': 'bg-rose-500',
        'Customer Success': 'bg-teal-500'
    };
    const departmentStats = departments.map((dept)=>{
        const deptEmployees = employees.filter((e)=>e.department === dept);
        const presentCount = deptEmployees.filter((e)=>e.status !== 'On Leave').length;
        const leaveCount = deptEmployees.filter((e)=>e.status === 'On Leave').length;
        return {
            name: dept,
            totalEmployees: deptEmployees.length,
            presentToday: presentCount,
            onLeaveToday: leaveCount,
            color: deptColors[dept] || 'bg-slate-500'
        };
    });
    const metrics = {
        totalEmployees,
        activeToday,
        remoteToday,
        onLeaveToday,
        lateArrivalsToday,
        pendingLeavesCount,
        attendanceRate,
        newHiresThisMonth: employees.filter((e)=>e.status === 'Probation').length || 4
    };
    return {
        metrics,
        departmentStats
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1f87r8_._.js.map
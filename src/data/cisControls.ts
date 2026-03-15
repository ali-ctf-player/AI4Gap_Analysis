export type ControlStatus = "compliant" | "non-compliant" | "in-progress";

export interface Safeguard {
  id: string;
  title: string;
  description: string;
  status: ControlStatus;
  implementationGroup: number;
}

export interface CISControl {
  id: number;
  title: string;
  description: string;
  safeguards: Safeguard[];
}

export const cisControls: CISControl[] = [
  {
    id: 1, title: "Inventory and Control of Enterprise Assets",
    description: "Actively manage all enterprise assets connected to the infrastructure.",
    safeguards: [
      { id: "1.1", title: "Establish and Maintain Detailed Enterprise Asset Inventory", description: "Establish and maintain an accurate, detailed, and up-to-date inventory of all enterprise assets.", status: "compliant", implementationGroup: 1 },
      { id: "1.2", title: "Address Unauthorized Assets", description: "Ensure that a process exists to address unauthorized assets on a weekly basis.", status: "in-progress", implementationGroup: 1 },
      { id: "1.3", title: "Utilize an Active Discovery Tool", description: "Utilize an active discovery tool to identify assets connected to the enterprise's network.", status: "non-compliant", implementationGroup: 2 },
      { id: "1.4", title: "Use Dynamic Host Configuration Protocol (DHCP) Logging", description: "Use DHCP logging on all DHCP servers or Internet Protocol (IP) address management tools.", status: "compliant", implementationGroup: 2 },
      { id: "1.5", title: "Use a Passive Asset Discovery Tool", description: "Use a passive discovery tool to identify assets connected to the enterprise's network.", status: "non-compliant", implementationGroup: 3 },
    ],
  },
  {
    id: 2, title: "Inventory and Control of Software Assets",
    description: "Actively manage all software on the network so that only authorized software is installed and can execute.",
    safeguards: [
      { id: "2.1", title: "Establish and Maintain a Software Inventory", description: "Establish and maintain a detailed inventory of all licensed software installed on enterprise assets.", status: "compliant", implementationGroup: 1 },
      { id: "2.2", title: "Ensure Authorized Software is Currently Supported", description: "Ensure that only currently supported software is designated as authorized.", status: "in-progress", implementationGroup: 1 },
      { id: "2.3", title: "Address Unauthorized Software", description: "Ensure that unauthorized software is either removed or the inventory is updated.", status: "non-compliant", implementationGroup: 1 },
      { id: "2.4", title: "Utilize Automated Software Inventory Tools", description: "Utilize software inventory tools, when possible, throughout the enterprise.", status: "non-compliant", implementationGroup: 2 },
      { id: "2.5", title: "Allowlist Authorized Software", description: "Use technical controls to ensure that only authorized software libraries can execute.", status: "non-compliant", implementationGroup: 2 },
      { id: "2.6", title: "Allowlist Authorized Libraries", description: "Use technical controls to ensure that only authorized software libraries can load.", status: "non-compliant", implementationGroup: 2 },
      { id: "2.7", title: "Allowlist Authorized Scripts", description: "Use technical controls to ensure that only authorized scripts can run.", status: "non-compliant", implementationGroup: 3 },
    ],
  },
  {
    id: 3, title: "Data Protection",
    description: "Develop processes and technical controls to identify, classify, securely handle, retain, and dispose of data.",
    safeguards: [
      { id: "3.1", title: "Establish and Maintain a Data Management Process", description: "Establish and maintain a data management process.", status: "in-progress", implementationGroup: 1 },
      { id: "3.2", title: "Establish and Maintain a Data Inventory", description: "Establish and maintain a data inventory, based on the enterprise's data management process.", status: "non-compliant", implementationGroup: 1 },
      { id: "3.3", title: "Configure Data Access Control Lists", description: "Configure data access control lists based on a user's need to know.", status: "compliant", implementationGroup: 1 },
      { id: "3.4", title: "Enforce Data Retention", description: "Retain data according to the enterprise's data management process.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 4, title: "Secure Configuration of Enterprise Assets and Software",
    description: "Establish and maintain the secure configuration of enterprise assets and software.",
    safeguards: [
      { id: "4.1", title: "Establish and Maintain a Secure Configuration Process", description: "Establish and maintain a secure configuration process for enterprise assets and software.", status: "compliant", implementationGroup: 1 },
      { id: "4.2", title: "Establish and Maintain a Secure Configuration Process for Network Infrastructure", description: "Establish and maintain a secure configuration process for network infrastructure.", status: "in-progress", implementationGroup: 1 },
      { id: "4.3", title: "Configure Automatic Session Locking on Enterprise Assets", description: "Configure automatic session locking on enterprise assets after a defined period of inactivity.", status: "compliant", implementationGroup: 1 },
    ],
  },
  {
    id: 5, title: "Account Management",
    description: "Use processes and tools to assign and manage authorization to credentials for user accounts.",
    safeguards: [
      { id: "5.1", title: "Establish and Maintain an Inventory of Accounts", description: "Establish and maintain an inventory of all accounts managed in the enterprise.", status: "compliant", implementationGroup: 1 },
      { id: "5.2", title: "Use Unique Passwords", description: "Use unique passwords for all enterprise assets. Best practice implementation includes MFA.", status: "compliant", implementationGroup: 1 },
      { id: "5.3", title: "Disable Dormant Accounts", description: "Delete or disable any dormant accounts after a period of 45 days of inactivity.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 6, title: "Access Control Management",
    description: "Use processes and tools to create, assign, manage, and revoke access credentials and privileges.",
    safeguards: [
      { id: "6.1", title: "Establish an Access Granting Process", description: "Establish and follow a process for granting access to enterprise assets and software.", status: "compliant", implementationGroup: 1 },
      { id: "6.2", title: "Establish an Access Revoking Process", description: "Establish and follow a process for revoking access when no longer needed.", status: "compliant", implementationGroup: 1 },
      { id: "6.3", title: "Require MFA for Externally-Exposed Applications", description: "Require MFA for all externally-exposed enterprise or third-party applications.", status: "non-compliant", implementationGroup: 1 },
    ],
  },
  {
    id: 7, title: "Continuous Vulnerability Management",
    description: "Develop a plan to continuously assess and track vulnerabilities on all enterprise assets.",
    safeguards: [
      { id: "7.1", title: "Establish and Maintain a Vulnerability Management Process", description: "Establish and maintain a documented vulnerability management process for enterprise assets.", status: "in-progress", implementationGroup: 1 },
      { id: "7.2", title: "Establish and Maintain a Remediation Process", description: "Establish and maintain a risk-based remediation strategy documented in a remediation process.", status: "non-compliant", implementationGroup: 1 },
      { id: "7.3", title: "Perform Automated Operating System Patch Management", description: "Perform OS updates on enterprise assets through automated patch management.", status: "compliant", implementationGroup: 1 },
    ],
  },
  {
    id: 8, title: "Audit Log Management",
    description: "Collect, alert, review, and retain audit logs of events that could help detect, understand, or recover from an attack.",
    safeguards: [
      { id: "8.1", title: "Establish and Maintain an Audit Log Management Process", description: "Establish and maintain an audit log management process.", status: "compliant", implementationGroup: 1 },
      { id: "8.2", title: "Collect Audit Logs", description: "Collect audit logs.", status: "compliant", implementationGroup: 1 },
      { id: "8.3", title: "Ensure Adequate Audit Log Storage", description: "Ensure that logging destinations maintain adequate storage.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 9, title: "Email and Web Browser Protections",
    description: "Improve protections and detections of threats from email and web vectors.",
    safeguards: [
      { id: "9.1", title: "Ensure Use of Only Fully Supported Browsers and Email Clients", description: "Ensure only fully supported browsers and email clients are allowed to execute.", status: "compliant", implementationGroup: 1 },
      { id: "9.2", title: "Use DNS Filtering Services", description: "Use DNS filtering services on all enterprise assets to block access to known malicious domains.", status: "non-compliant", implementationGroup: 1 },
    ],
  },
  {
    id: 10, title: "Malware Defenses",
    description: "Prevent or control the installation, spread, and execution of malicious applications, code, or scripts.",
    safeguards: [
      { id: "10.1", title: "Deploy and Maintain Anti-Malware Software", description: "Install and maintain anti-malware software on all enterprise assets.", status: "compliant", implementationGroup: 1 },
      { id: "10.2", title: "Configure Automatic Anti-Malware Signature Updates", description: "Configure automatic updates for anti-malware signature files.", status: "compliant", implementationGroup: 1 },
      { id: "10.3", title: "Disable Autorun and Autoplay for Removable Media", description: "Disable autorun and autoplay auto-execute functionality for removable media.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 11, title: "Data Recovery",
    description: "Establish and maintain data recovery practices sufficient to restore in-scope enterprise assets.",
    safeguards: [
      { id: "11.1", title: "Establish and Maintain a Data Recovery Process", description: "Establish and maintain a data recovery process.", status: "compliant", implementationGroup: 1 },
      { id: "11.2", title: "Perform Automated Backups", description: "Perform automated backups of in-scope enterprise assets.", status: "compliant", implementationGroup: 1 },
      { id: "11.3", title: "Protect Recovery Data", description: "Protect recovery data with equivalent controls to the original data.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 12, title: "Network Infrastructure Management",
    description: "Establish and maintain the secure configuration of network devices.",
    safeguards: [
      { id: "12.1", title: "Ensure Network Infrastructure is Up-to-Date", description: "Ensure network infrastructure is kept up-to-date.", status: "compliant", implementationGroup: 1 },
      { id: "12.2", title: "Establish and Maintain a Secure Network Architecture", description: "Establish and maintain a secure network architecture.", status: "in-progress", implementationGroup: 2 },
    ],
  },
  {
    id: 13, title: "Network Monitoring and Defense",
    description: "Operate processes and tooling to establish and maintain comprehensive network monitoring and defense.",
    safeguards: [
      { id: "13.1", title: "Centralize Security Event Alerting", description: "Centralize security event alerting across enterprise assets.", status: "non-compliant", implementationGroup: 2 },
      { id: "13.2", title: "Deploy a Host-Based Intrusion Detection Solution", description: "Deploy a host-based intrusion detection solution on enterprise assets.", status: "non-compliant", implementationGroup: 2 },
    ],
  },
  {
    id: 14, title: "Security Awareness and Skills Training",
    description: "Establish and maintain a security awareness program to influence behavior.",
    safeguards: [
      { id: "14.1", title: "Establish and Maintain a Security Awareness Program", description: "Establish and maintain a security awareness program.", status: "compliant", implementationGroup: 1 },
      { id: "14.2", title: "Train Workforce Members to Recognize Social Engineering Attacks", description: "Train workforce members to recognize social engineering attacks.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 15, title: "Service Provider Management",
    description: "Develop a process to evaluate service providers who hold sensitive data or are responsible for critical IT platforms.",
    safeguards: [
      { id: "15.1", title: "Establish and Maintain an Inventory of Service Providers", description: "Establish and maintain an inventory of service providers.", status: "in-progress", implementationGroup: 1 },
      { id: "15.2", title: "Establish and Maintain a Service Provider Management Policy", description: "Establish and maintain a service provider management policy.", status: "non-compliant", implementationGroup: 2 },
    ],
  },
  {
    id: 16, title: "Application Software Security",
    description: "Manage the security life cycle of in-house developed, hosted, or acquired software.",
    safeguards: [
      { id: "16.1", title: "Establish and Maintain a Secure Application Development Process", description: "Establish and maintain a secure application development process.", status: "non-compliant", implementationGroup: 2 },
      { id: "16.2", title: "Establish and Maintain a Process to Accept and Address Software Vulnerabilities", description: "Establish and maintain a process to accept and address vulnerabilities in developed software.", status: "in-progress", implementationGroup: 2 },
    ],
  },
  {
    id: 17, title: "Incident Response Management",
    description: "Establish a program to develop and maintain an incident response capability.",
    safeguards: [
      { id: "17.1", title: "Designate Personnel to Manage Incident Handling", description: "Designate one key person and at least one backup to manage the enterprise's incident handling process.", status: "compliant", implementationGroup: 1 },
      { id: "17.2", title: "Establish and Maintain Contact Information for Reporting Security Incidents", description: "Establish and maintain contact information for parties that need to be informed of security incidents.", status: "compliant", implementationGroup: 1 },
      { id: "17.3", title: "Establish and Maintain an Enterprise Process for Reporting Incidents", description: "Establish and maintain an enterprise process for the workforce to report security incidents.", status: "in-progress", implementationGroup: 1 },
    ],
  },
  {
    id: 18, title: "Penetration Testing",
    description: "Test the effectiveness and resiliency of enterprise assets through identifying and exploiting weaknesses in controls.",
    safeguards: [
      { id: "18.1", title: "Establish and Maintain a Penetration Testing Program", description: "Establish and maintain a penetration testing program appropriate to the size, complexity, and maturity.", status: "non-compliant", implementationGroup: 2 },
      { id: "18.2", title: "Perform Periodic External Penetration Tests", description: "Perform periodic external penetration tests based on program requirements.", status: "non-compliant", implementationGroup: 2 },
      { id: "18.3", title: "Remediate Penetration Test Findings", description: "Remediate penetration test findings based on the enterprise's policy for remediation scope and prioritization.", status: "non-compliant", implementationGroup: 2 },
    ],
  },
];

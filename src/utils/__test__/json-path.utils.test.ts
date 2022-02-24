import { get, set } from "lodash";
import { getPaths } from "../json-path.utils";

const obj = {
  flag: 1,
  basic: {
    address: "সাভার, ঢাকা",
    fo_code: "5",
    project_id: "1",
    upazila_id: "1",
    district_id: "2",
    samity_name: "Samity",
    institute_code: "1236544",
    institute_name: "ABC High School",
    work_place_lat: "-28.791732",
    work_place_long: "-5.738692",
    work_area_radius: 50,
    institute_address: "Dhaka, Bangladesh",
    weekly_meeting_day: "Tuesday",
  },
  setup: {
    share_amount: 140,
    admission_fee: 200,
    member_max_age: 60,
    member_min_age: 10,
    group_max_member: 10,
    group_min_member: 4,
    samity_max_member: 40,
    samity_min_member: 10,
    samity_member_type: "F",
  },
  member_info: [
    {
      data: {
        age: "21",
        gender: "F",
        name_bn: "Abdul Kabir",
        name_en: "Abdul Kabir",
        religion: "56",
        education: "81",
        birth_date: "1/4/2001",
        occupation: "7",
        doc_type_id: "SIG",
        document_no: "123654",
        father_name: "Abdul Kabir",
        mother_name: "Nazmula",
        spouse_name: "Afrina Kabir",
        mobile_number: "09766",
        yearly_income: "1200",
        marital_status: "71",
      },
      address: {
        per: {
          union: 1721,
          upazila: 35,
          ward_no: "llllllll",
          district: 6,
          post_code: "llll",
          holding_no: "lllllll",
          village_name: "lllll",
        },
        pre: {
          union: 1721,
          upazila: 35,
          ward_no: "llllllll",
          district: 6,
          post_code: "llll",
          holding_no: "lllllll",
          village_name: "lllll",
        },
      },
      nominee: [
        {
          nid: "Rudra",
          relation: "68",
          percentage: "565",
          nominee_name: "Hrithik",
          nominee_sign: "1641279860497-Screenshot (1).png",
          nominee_picture: "1641279860155-Screenshot (7).png",
        },
        {
          nid: "Uzzaman",
          relation: "46",
          percentage: "565",
          nominee_name: "Hasib",
          nominee_sign: "1641279860516-Screenshot (4).png",
          nominee_picture: "1641279860497-OIP.jpg",
        },
      ],
      member_sign: "1641279860133-Screenshot (4).png",
      guardian_info: {
        relation: "27",
        occupation: "7",
        document_no: "123456",
        guardian_name: "qeqwe",
      },
      member_picture: "1641279860138-Screenshot (6).png",
      member_doc_back: "1641279860074-Screenshot (3).png",
      member_doc_front: "1641279860084-Screenshot (1).png",
    },
  ],
};

const test = [obj, obj];

const query: any = [
  "member_info.[].nominee.[].nominee_sign",
  "member_info.[].nominee.[].nominee_picture",
  "member_info.[].member_picture",
];

describe("test utils", () => {
  it("test", () => {
    const results = getPaths(test, query);

    console.log({ results, query });

    expect(true).toBe(true);
  });

  it("value", () => {
    const results = getPaths(test, query);

    const value = get(test, results[0]);
    const [{ member_info }] = set(test, `${results[0]}_url`, "url1234567");
    console.log(member_info[0].nominee);
  });
});

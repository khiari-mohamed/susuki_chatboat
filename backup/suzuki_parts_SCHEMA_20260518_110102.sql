--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2026-05-18 11:01:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 12 (class 2615 OID 831785)
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- TOC entry 8 (class 2615 OID 831781)
-- Name: core; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA core;


--
-- TOC entry 10 (class 2615 OID 831783)
-- Name: mart; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA mart;


--
-- TOC entry 11 (class 2615 OID 831784)
-- Name: metadata; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA metadata;


--
-- TOC entry 6 (class 2615 OID 218916)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 7 (class 2615 OID 831780)
-- Name: raw; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA raw;


--
-- TOC entry 9 (class 2615 OID 831782)
-- Name: rel; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA rel;


--
-- TOC entry 2 (class 3079 OID 1201651)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 831828)
-- Name: items; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.items (
    item_id bigint NOT NULL,
    reference text NOT NULL,
    reference_norm text NOT NULL,
    designation text,
    designation2 text,
    search_designation text,
    make_code text,
    model_code_raw text,
    model_code_norm text,
    version_raw text,
    unit_price numeric(18,6),
    stock_consolide numeric(18,4),
    stock numeric(18,4),
    effective_stock numeric(18,4),
    stock_quality_flag text,
    blocked boolean,
    last_modified_date date,
    a_scanner_cb boolean,
    source_priority smallint,
    source_batch_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 234 (class 1259 OID 831827)
-- Name: items_item_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.items_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 234
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.items_item_id_seq OWNED BY core.items.item_id;


--
-- TOC entry 238 (class 1259 OID 831856)
-- Name: model_alias; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.model_alias (
    alias text NOT NULL,
    normalized_model text NOT NULL,
    brand text NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 831843)
-- Name: vehicles; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.vehicles (
    vehicle_id bigint NOT NULL,
    vin text,
    vin_norm text,
    serial_no text,
    immatriculation text,
    immat_norm text,
    make_code text,
    model_code_raw text,
    model_code_norm text,
    type_vehicule text,
    type_mine text,
    status_code text,
    delivery_date date,
    source_batch_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 236 (class 1259 OID 831842)
-- Name: vehicles_vehicle_id_seq; Type: SEQUENCE; Schema: core; Owner: -
--

CREATE SEQUENCE core.vehicles_vehicle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 236
-- Name: vehicles_vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: core; Owner: -
--

ALTER SEQUENCE core.vehicles_vehicle_id_seq OWNED BY core.vehicles.vehicle_id;


--
-- TOC entry 239 (class 1259 OID 831880)
-- Name: chatbot_parts; Type: VIEW; Schema: mart; Owner: -
--

CREATE VIEW mart.chatbot_parts AS
 SELECT reference,
    designation,
    unit_price,
    make_code,
    model_code_norm AS model_code,
    version_raw AS version,
    effective_stock,
    stock_quality_flag
   FROM core.items;


--
-- TOC entry 242 (class 1259 OID 831889)
-- Name: item_vehicle_fitment; Type: TABLE; Schema: rel; Owner: -
--

CREATE TABLE rel.item_vehicle_fitment (
    fitment_id bigint NOT NULL,
    item_id bigint NOT NULL,
    vehicle_id bigint,
    make_code text,
    model_code_norm text,
    type_vehicule text,
    version_raw text,
    match_rule text NOT NULL,
    confidence text NOT NULL,
    is_active boolean DEFAULT true,
    source_batch_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 243 (class 1259 OID 831925)
-- Name: chatbot_parts_with_fitment; Type: VIEW; Schema: mart; Owner: -
--

CREATE VIEW mart.chatbot_parts_with_fitment AS
 SELECT i.item_id AS id,
    i.reference,
    i.designation,
    i.unit_price AS prixht,
    i.effective_stock AS stock,
    i.make_code,
    i.model_code_norm AS model_code,
    i.version_raw AS version,
    i.stock_quality_flag,
    f.match_rule,
    f.confidence
   FROM (core.items i
     LEFT JOIN rel.item_vehicle_fitment f ON ((i.item_id = f.item_id)))
  WHERE ((f.is_active = true) OR (f.fitment_id IS NULL));


--
-- TOC entry 240 (class 1259 OID 831884)
-- Name: chatbot_vehicles; Type: VIEW; Schema: mart; Owner: -
--

CREATE VIEW mart.chatbot_vehicles AS
 SELECT vin,
    immatriculation,
    make_code,
    model_code_norm AS model_code,
    type_vehicule,
    type_mine,
    status_code
   FROM core.vehicles;


--
-- TOC entry 233 (class 1259 OID 831815)
-- Name: field_map; Type: TABLE; Schema: metadata; Owner: -
--

CREATE TABLE metadata.field_map (
    enabled text,
    field_no integer,
    field_name text,
    caption text,
    data_type text,
    length integer,
    description text,
    field_class text,
    option_string text
);


--
-- TOC entry 222 (class 1259 OID 218917)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 218971)
-- Name: chat_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_feedback (
    id text NOT NULL,
    message_id text NOT NULL,
    rating integer,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 218955)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id text NOT NULL,
    session_id text NOT NULL,
    sender text NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata jsonb
);


--
-- TOC entry 225 (class 1259 OID 218963)
-- Name: chat_prompts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_prompts (
    id text NOT NULL,
    session_id text NOT NULL,
    prompt_text text NOT NULL,
    response_text text NOT NULL,
    model text,
    tokens integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 218947)
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_sessions (
    id text NOT NULL,
    vehicle_info jsonb,
    started_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ended_at timestamp(3) without time zone,
    metadata jsonb
);


--
-- TOC entry 251 (class 1259 OID 1201360)
-- Name: fitment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fitment (
    id integer NOT NULL,
    part_reference character varying(50) NOT NULL,
    type_code character varying(30) NOT NULL,
    model_name character varying(100) NOT NULL
);


--
-- TOC entry 250 (class 1259 OID 1201359)
-- Name: fitment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fitment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 250
-- Name: fitment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fitment_id_seq OWNED BY public.fitment.id;


--
-- TOC entry 255 (class 1259 OID 1201374)
-- Name: item_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.item_references (
    id integer NOT NULL,
    part_reference character varying(50) NOT NULL,
    reference_no character varying(50) NOT NULL,
    reference_type character varying(20)
);


--
-- TOC entry 254 (class 1259 OID 1201373)
-- Name: item_references_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.item_references_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 254
-- Name: item_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.item_references_id_seq OWNED BY public.item_references.id;


--
-- TOC entry 245 (class 1259 OID 1201334)
-- Name: parts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parts (
    id integer NOT NULL,
    reference character varying(50) NOT NULL,
    designation text NOT NULL,
    search_description character varying(100),
    designation_2 character varying(100),
    prix_ht numeric(10,3),
    prix_ttc numeric(10,3),
    unite character varying(20),
    categorie character varying(50),
    fabricant character varying(100),
    fournisseur_code character varying(50),
    source character varying(20) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 1201333)
-- Name: parts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 244
-- Name: parts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parts_id_seq OWNED BY public.parts.id;


--
-- TOC entry 247 (class 1259 OID 1201344)
-- Name: stock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    reference character varying(50) NOT NULL,
    total_quantity integer DEFAULT 0 NOT NULL,
    statut character varying(20) DEFAULT 'Indisponible'::character varying NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 246 (class 1259 OID 1201343)
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 246
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- TOC entry 257 (class 1259 OID 1201381)
-- Name: synonyms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.synonyms (
    id integer NOT NULL,
    mot character varying(100) NOT NULL,
    canonical character varying(100) NOT NULL,
    langue character varying(5) DEFAULT 'fr'::character varying NOT NULL
);


--
-- TOC entry 256 (class 1259 OID 1201380)
-- Name: synonyms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.synonyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 256
-- Name: synonyms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.synonyms_id_seq OWNED BY public.synonyms.id;


--
-- TOC entry 227 (class 1259 OID 243820)
-- Name: upload_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upload_tracking (
    id text NOT NULL,
    user_ip character varying(45) NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    success boolean DEFAULT true NOT NULL,
    vehicle_info jsonb
);


--
-- TOC entry 249 (class 1259 OID 1201353)
-- Name: vehicle_type_master; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_type_master (
    id integer NOT NULL,
    type_code character varying(30) NOT NULL,
    model_name character varying(100) NOT NULL
);


--
-- TOC entry 248 (class 1259 OID 1201352)
-- Name: vehicle_type_master_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicle_type_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 248
-- Name: vehicle_type_master_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicle_type_master_id_seq OWNED BY public.vehicle_type_master.id;


--
-- TOC entry 253 (class 1259 OID 1201367)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    vehicle_no character varying(20) NOT NULL,
    vin character varying(25),
    marque character varying(20),
    modele character varying(20),
    modele_description character varying(100),
    statut character varying(20)
);


--
-- TOC entry 252 (class 1259 OID 1201366)
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 252
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- TOC entry 228 (class 1259 OID 831786)
-- Name: ingest_batch; Type: TABLE; Schema: raw; Owner: -
--

CREATE TABLE raw.ingest_batch (
    batch_id uuid NOT NULL,
    source_name text NOT NULL,
    source_file text NOT NULL,
    file_hash text,
    row_count integer,
    loaded_at timestamp with time zone DEFAULT now(),
    status text,
    notes text
);


--
-- TOC entry 229 (class 1259 OID 831794)
-- Name: ingest_rejects; Type: TABLE; Schema: raw; Owner: -
--

CREATE TABLE raw.ingest_rejects (
    batch_id uuid NOT NULL,
    source_name text NOT NULL,
    row_number integer,
    raw_payload jsonb NOT NULL,
    reject_reason text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 231 (class 1259 OID 831805)
-- Name: items_articles_xlsx; Type: TABLE; Schema: raw; Owner: -
--

CREATE TABLE raw.items_articles_xlsx (
    batch_id uuid NOT NULL,
    row_number integer NOT NULL,
    no_raw text,
    description_raw text,
    description2_raw text,
    make_code_raw text,
    unit_price_raw text,
    stock_raw text,
    stock_consolide_raw text,
    last_modified_raw text,
    blocked_raw text,
    raw_payload jsonb NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 831800)
-- Name: items_prod_csv; Type: TABLE; Schema: raw; Owner: -
--

CREATE TABLE raw.items_prod_csv (
    batch_id uuid NOT NULL,
    row_number integer NOT NULL,
    reference_raw text,
    designation_raw text,
    unit_price_raw text,
    make_code_raw text,
    model_code_raw text,
    version_raw text,
    a_scanner_cb_raw text,
    raw_payload jsonb NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 831810)
-- Name: vehicles_xlsx; Type: TABLE; Schema: raw; Owner: -
--

CREATE TABLE raw.vehicles_xlsx (
    batch_id uuid NOT NULL,
    row_number integer NOT NULL,
    vin_raw text,
    serial_no_raw text,
    make_code_raw text,
    model_code_raw text,
    immat_raw text,
    type_vehicule_raw text,
    type_mine_raw text,
    status_raw text,
    delivery_date_raw text,
    raw_payload jsonb NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 831888)
-- Name: item_vehicle_fitment_fitment_id_seq; Type: SEQUENCE; Schema: rel; Owner: -
--

CREATE SEQUENCE rel.item_vehicle_fitment_fitment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 241
-- Name: item_vehicle_fitment_fitment_id_seq; Type: SEQUENCE OWNED BY; Schema: rel; Owner: -
--

ALTER SEQUENCE rel.item_vehicle_fitment_fitment_id_seq OWNED BY rel.item_vehicle_fitment.fitment_id;


--
-- TOC entry 4862 (class 2604 OID 831831)
-- Name: items item_id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.items ALTER COLUMN item_id SET DEFAULT nextval('core.items_item_id_seq'::regclass);


--
-- TOC entry 4865 (class 2604 OID 831846)
-- Name: vehicles vehicle_id; Type: DEFAULT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.vehicles ALTER COLUMN vehicle_id SET DEFAULT nextval('core.vehicles_vehicle_id_seq'::regclass);


--
-- TOC entry 4877 (class 2604 OID 1201363)
-- Name: fitment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitment ALTER COLUMN id SET DEFAULT nextval('public.fitment_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 1201377)
-- Name: item_references id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_references ALTER COLUMN id SET DEFAULT nextval('public.item_references_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 1201337)
-- Name: parts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parts ALTER COLUMN id SET DEFAULT nextval('public.parts_id_seq'::regclass);


--
-- TOC entry 4873 (class 2604 OID 1201347)
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 1201384)
-- Name: synonyms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.synonyms ALTER COLUMN id SET DEFAULT nextval('public.synonyms_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 1201356)
-- Name: vehicle_type_master id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_type_master ALTER COLUMN id SET DEFAULT nextval('public.vehicle_type_master_id_seq'::regclass);


--
-- TOC entry 4878 (class 2604 OID 1201370)
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 831892)
-- Name: item_vehicle_fitment fitment_id; Type: DEFAULT; Schema: rel; Owner: -
--

ALTER TABLE ONLY rel.item_vehicle_fitment ALTER COLUMN fitment_id SET DEFAULT nextval('rel.item_vehicle_fitment_fitment_id_seq'::regclass);


--
-- TOC entry 4908 (class 2606 OID 831837)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);


--
-- TOC entry 4910 (class 2606 OID 831839)
-- Name: items items_reference_key; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.items
    ADD CONSTRAINT items_reference_key UNIQUE (reference);


--
-- TOC entry 4917 (class 2606 OID 831862)
-- Name: model_alias model_alias_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.model_alias
    ADD CONSTRAINT model_alias_pkey PRIMARY KEY (alias);


--
-- TOC entry 4915 (class 2606 OID 831852)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id);


--
-- TOC entry 4883 (class 2606 OID 218925)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 218978)
-- Name: chat_feedback chat_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_feedback
    ADD CONSTRAINT chat_feedback_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 218962)
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 218970)
-- Name: chat_prompts chat_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_prompts
    ADD CONSTRAINT chat_prompts_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 218954)
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 1201365)
-- Name: fitment fitment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitment
    ADD CONSTRAINT fitment_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 1201379)
-- Name: item_references item_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_references
    ADD CONSTRAINT item_references_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 1201342)
-- Name: parts parts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 1201351)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- TOC entry 4959 (class 2606 OID 1201387)
-- Name: synonyms synonyms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.synonyms
    ADD CONSTRAINT synonyms_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 243828)
-- Name: upload_tracking upload_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_tracking
    ADD CONSTRAINT upload_tracking_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 1201358)
-- Name: vehicle_type_master vehicle_type_master_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_type_master
    ADD CONSTRAINT vehicle_type_master_pkey PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 1201372)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 831793)
-- Name: ingest_batch ingest_batch_pkey; Type: CONSTRAINT; Schema: raw; Owner: -
--

ALTER TABLE ONLY raw.ingest_batch
    ADD CONSTRAINT ingest_batch_pkey PRIMARY KEY (batch_id);


--
-- TOC entry 4919 (class 2606 OID 831900)
-- Name: item_vehicle_fitment item_vehicle_fitment_item_id_model_code_norm_match_rule_key; Type: CONSTRAINT; Schema: rel; Owner: -
--

ALTER TABLE ONLY rel.item_vehicle_fitment
    ADD CONSTRAINT item_vehicle_fitment_item_id_model_code_norm_match_rule_key UNIQUE (item_id, model_code_norm, match_rule);


--
-- TOC entry 4921 (class 2606 OID 831898)
-- Name: item_vehicle_fitment item_vehicle_fitment_pkey; Type: CONSTRAINT; Schema: rel; Owner: -
--

ALTER TABLE ONLY rel.item_vehicle_fitment
    ADD CONSTRAINT item_vehicle_fitment_pkey PRIMARY KEY (fitment_id);


--
-- TOC entry 4905 (class 1259 OID 831841)
-- Name: core_items_make_model_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_items_make_model_idx ON core.items USING btree (make_code, model_code_norm);


--
-- TOC entry 4906 (class 1259 OID 831840)
-- Name: core_items_reference_norm_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_items_reference_norm_idx ON core.items USING btree (reference_norm);


--
-- TOC entry 4911 (class 1259 OID 831854)
-- Name: core_vehicles_immat_norm_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_vehicles_immat_norm_unique ON core.vehicles USING btree (immat_norm);


--
-- TOC entry 4912 (class 1259 OID 831855)
-- Name: core_vehicles_make_model_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX core_vehicles_make_model_idx ON core.vehicles USING btree (make_code, model_code_norm);


--
-- TOC entry 4913 (class 1259 OID 831853)
-- Name: core_vehicles_vin_norm_unique; Type: INDEX; Schema: core; Owner: -
--

CREATE UNIQUE INDEX core_vehicles_vin_norm_unique ON core.vehicles USING btree (vin_norm);


--
-- TOC entry 4895 (class 1259 OID 218992)
-- Name: chat_feedback_message_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chat_feedback_message_id_key ON public.chat_feedback USING btree (message_id);


--
-- TOC entry 4898 (class 1259 OID 218993)
-- Name: chat_feedback_rating_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_feedback_rating_idx ON public.chat_feedback USING btree (rating);


--
-- TOC entry 4889 (class 1259 OID 218988)
-- Name: chat_messages_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_messages_session_id_idx ON public.chat_messages USING btree (session_id);


--
-- TOC entry 4890 (class 1259 OID 218989)
-- Name: chat_messages_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_messages_timestamp_idx ON public.chat_messages USING btree ("timestamp");


--
-- TOC entry 4891 (class 1259 OID 218991)
-- Name: chat_prompts_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_prompts_created_at_idx ON public.chat_prompts USING btree (created_at);


--
-- TOC entry 4894 (class 1259 OID 218990)
-- Name: chat_prompts_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_prompts_session_id_idx ON public.chat_prompts USING btree (session_id);


--
-- TOC entry 4886 (class 1259 OID 218987)
-- Name: chat_sessions_started_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_sessions_started_at_idx ON public.chat_sessions USING btree (started_at);


--
-- TOC entry 4939 (class 1259 OID 1201396)
-- Name: fitment_model_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fitment_model_name_idx ON public.fitment USING btree (model_name);


--
-- TOC entry 4940 (class 1259 OID 1201397)
-- Name: fitment_part_reference_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fitment_part_reference_idx ON public.fitment USING btree (part_reference);


--
-- TOC entry 4941 (class 1259 OID 1201398)
-- Name: fitment_part_reference_type_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX fitment_part_reference_type_code_key ON public.fitment USING btree (part_reference, type_code);


--
-- TOC entry 4944 (class 1259 OID 1201395)
-- Name: fitment_type_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fitment_type_code_idx ON public.fitment USING btree (type_code);


--
-- TOC entry 4945 (class 1259 OID 1201650)
-- Name: idx_vehicles_vin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vehicles_vin ON public.vehicles USING btree (vin);


--
-- TOC entry 4951 (class 1259 OID 1201404)
-- Name: item_references_part_reference_reference_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX item_references_part_reference_reference_no_key ON public.item_references USING btree (part_reference, reference_no);


--
-- TOC entry 4954 (class 1259 OID 1201403)
-- Name: item_references_reference_no_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX item_references_reference_no_idx ON public.item_references USING btree (reference_no);


--
-- TOC entry 4924 (class 1259 OID 1201389)
-- Name: parts_categorie_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX parts_categorie_idx ON public.parts USING btree (categorie);


--
-- TOC entry 4925 (class 1259 OID 1201743)
-- Name: parts_designation_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX parts_designation_trgm_idx ON public.parts USING gin (designation public.gin_trgm_ops);


--
-- TOC entry 4926 (class 1259 OID 1201390)
-- Name: parts_fabricant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX parts_fabricant_idx ON public.parts USING btree (fabricant);


--
-- TOC entry 4927 (class 1259 OID 1201391)
-- Name: parts_fournisseur_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX parts_fournisseur_code_idx ON public.parts USING btree (fournisseur_code);


--
-- TOC entry 4930 (class 1259 OID 1201388)
-- Name: parts_reference_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX parts_reference_key ON public.parts USING btree (reference);


--
-- TOC entry 4931 (class 1259 OID 1201744)
-- Name: parts_reference_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX parts_reference_trgm_idx ON public.parts USING gin (reference public.gin_trgm_ops);


--
-- TOC entry 4934 (class 1259 OID 1201392)
-- Name: stock_reference_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX stock_reference_key ON public.stock USING btree (reference);


--
-- TOC entry 4935 (class 1259 OID 1201393)
-- Name: stock_statut_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_statut_idx ON public.stock USING btree (statut);


--
-- TOC entry 4955 (class 1259 OID 1201406)
-- Name: synonyms_canonical_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX synonyms_canonical_idx ON public.synonyms USING btree (canonical);


--
-- TOC entry 4956 (class 1259 OID 1201405)
-- Name: synonyms_mot_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX synonyms_mot_idx ON public.synonyms USING btree (mot);


--
-- TOC entry 4957 (class 1259 OID 1201407)
-- Name: synonyms_mot_langue_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX synonyms_mot_langue_key ON public.synonyms USING btree (mot, langue);


--
-- TOC entry 4901 (class 1259 OID 243830)
-- Name: upload_tracking_uploaded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX upload_tracking_uploaded_at_idx ON public.upload_tracking USING btree (uploaded_at);


--
-- TOC entry 4902 (class 1259 OID 243829)
-- Name: upload_tracking_user_ip_uploaded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX upload_tracking_user_ip_uploaded_at_idx ON public.upload_tracking USING btree (user_ip, uploaded_at);


--
-- TOC entry 4938 (class 1259 OID 1201394)
-- Name: vehicle_type_master_type_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicle_type_master_type_code_key ON public.vehicle_type_master USING btree (type_code);


--
-- TOC entry 4946 (class 1259 OID 1201402)
-- Name: vehicles_modele_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicles_modele_idx ON public.vehicles USING btree (modele);


--
-- TOC entry 4949 (class 1259 OID 1201399)
-- Name: vehicles_vehicle_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX vehicles_vehicle_no_key ON public.vehicles USING btree (vehicle_no);


--
-- TOC entry 4950 (class 1259 OID 1201622)
-- Name: vehicles_vin_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX vehicles_vin_idx ON public.vehicles USING btree (vin);


--
-- TOC entry 4922 (class 1259 OID 831911)
-- Name: rel_fitment_item_idx; Type: INDEX; Schema: rel; Owner: -
--

CREATE INDEX rel_fitment_item_idx ON rel.item_vehicle_fitment USING btree (item_id);


--
-- TOC entry 4923 (class 1259 OID 831912)
-- Name: rel_fitment_model_idx; Type: INDEX; Schema: rel; Owner: -
--

CREATE INDEX rel_fitment_model_idx ON rel.item_vehicle_fitment USING btree (model_code_norm);


--
-- TOC entry 4962 (class 2606 OID 219004)
-- Name: chat_feedback chat_feedback_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_feedback
    ADD CONSTRAINT chat_feedback_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4960 (class 2606 OID 218994)
-- Name: chat_messages chat_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4961 (class 2606 OID 218999)
-- Name: chat_prompts chat_prompts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_prompts
    ADD CONSTRAINT chat_prompts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4966 (class 2606 OID 1201413)
-- Name: fitment fitment_part_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitment
    ADD CONSTRAINT fitment_part_reference_fkey FOREIGN KEY (part_reference) REFERENCES public.parts(reference) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4967 (class 2606 OID 1201736)
-- Name: fitment fitment_type_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fitment
    ADD CONSTRAINT fitment_type_code_fkey FOREIGN KEY (type_code) REFERENCES public.vehicle_type_master(type_code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4968 (class 2606 OID 1201423)
-- Name: item_references item_references_part_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_references
    ADD CONSTRAINT item_references_part_reference_fkey FOREIGN KEY (part_reference) REFERENCES public.parts(reference) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4965 (class 2606 OID 1201408)
-- Name: stock stock_reference_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_reference_fkey FOREIGN KEY (reference) REFERENCES public.parts(reference) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4963 (class 2606 OID 831901)
-- Name: item_vehicle_fitment item_vehicle_fitment_item_id_fkey; Type: FK CONSTRAINT; Schema: rel; Owner: -
--

ALTER TABLE ONLY rel.item_vehicle_fitment
    ADD CONSTRAINT item_vehicle_fitment_item_id_fkey FOREIGN KEY (item_id) REFERENCES core.items(item_id);


--
-- TOC entry 4964 (class 2606 OID 831906)
-- Name: item_vehicle_fitment item_vehicle_fitment_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: rel; Owner: -
--

ALTER TABLE ONLY rel.item_vehicle_fitment
    ADD CONSTRAINT item_vehicle_fitment_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES core.vehicles(vehicle_id);


-- Completed on 2026-05-18 11:01:20

--
-- PostgreSQL database dump complete
--


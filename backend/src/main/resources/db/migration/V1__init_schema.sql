-- =====================================================================
-- Flight Booking System — Initial Schema
-- =====================================================================

-- ── ENUMS ──
CREATE TYPE user_role        AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE user_status      AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE seat_class_type  AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST');
CREATE TYPE trip_type        AS ENUM ('ONE_WAY', 'ROUND_TRIP');
CREATE TYPE booking_status   AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED');
CREATE TYPE flight_status    AS ENUM ('SCHEDULED', 'DELAYED', 'BOARDING', 'IN_FLIGHT', 'LANDED', 'CANCELLED');
CREATE TYPE segment_direction AS ENUM ('OUTBOUND', 'RETURN');
CREATE TYPE payment_status   AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE payment_method   AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'E_WALLET');
CREATE TYPE ancillary_type   AS ENUM ('BAGGAGE', 'MEAL', 'SEAT_SELECTION', 'INSURANCE', 'LOUNGE_ACCESS', 'PRIORITY_BOARDING');

-- ══════════════════════════════════════════════════════════════════════
-- 1. USERS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    role            user_role       NOT NULL DEFAULT 'CUSTOMER',
    status          user_status     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- ══════════════════════════════════════════════════════════════════════
-- 2. AIRLINES
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE airlines (
    id              BIGSERIAL       PRIMARY KEY,
    code            VARCHAR(3)      NOT NULL UNIQUE,   -- IATA code
    name            VARCHAR(255)    NOT NULL,
    logo_url        VARCHAR(500),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- 3. AIRPORTS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE airports (
    id              BIGSERIAL       PRIMARY KEY,
    code            VARCHAR(4)      NOT NULL UNIQUE,   -- IATA code
    name            VARCHAR(255)    NOT NULL,
    city            VARCHAR(255)    NOT NULL,
    country         VARCHAR(255)    NOT NULL,
    timezone        VARCHAR(50),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- 4. FLIGHTS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE flights (
    id                      BIGSERIAL       PRIMARY KEY,
    airline_id              BIGINT          NOT NULL REFERENCES airlines(id),
    flight_number           VARCHAR(10)     NOT NULL,
    departure_airport_id    BIGINT          NOT NULL REFERENCES airports(id),
    arrival_airport_id      BIGINT          NOT NULL REFERENCES airports(id),
    departure_time          TIMESTAMPTZ     NOT NULL,
    arrival_time            TIMESTAMPTZ     NOT NULL,
    status                  flight_status   NOT NULL DEFAULT 'SCHEDULED',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flights_airline        ON flights (airline_id);
CREATE INDEX idx_flights_departure      ON flights (departure_airport_id, departure_time);
CREATE INDEX idx_flights_arrival        ON flights (arrival_airport_id);
CREATE INDEX idx_flights_number         ON flights (flight_number);

-- ══════════════════════════════════════════════════════════════════════
-- 5. FLIGHT SEGMENTS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE flight_segments (
    id                      BIGSERIAL       PRIMARY KEY,
    flight_id               BIGINT          NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    origin_airport_id       BIGINT          NOT NULL REFERENCES airports(id),
    destination_airport_id  BIGINT          NOT NULL REFERENCES airports(id),
    departure_time          TIMESTAMPTZ     NOT NULL,
    arrival_time            TIMESTAMPTZ     NOT NULL,
    sequence_order          INT             NOT NULL DEFAULT 1,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flight_segments_flight ON flight_segments (flight_id);

-- ══════════════════════════════════════════════════════════════════════
-- ══════════════════════════════════════════════════════════════════════
-- 6. SEAT CLASSES (Đã sửa thêm version)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE seat_classes (
    id              BIGSERIAL           PRIMARY KEY,
    flight_id       BIGINT              NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    class_type      seat_class_type     NOT NULL,
    total_seats     INT                 NOT NULL,
    available_seats INT                 NOT NULL,
    base_price      NUMERIC(15, 2)      NOT NULL,
    version         INT                 NOT NULL DEFAULT 0,  -- <--- THÊM DÒNG NÀY
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_seat_class_per_flight UNIQUE (flight_id, class_type)
);

CREATE INDEX idx_seat_classes_flight ON seat_classes (flight_id);

-- ══════════════════════════════════════════════════════════════════════
-- 7. BOOKINGS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE bookings (
    id                  BIGSERIAL           PRIMARY KEY,
    user_id             BIGINT              NOT NULL REFERENCES users(id),
    booking_reference   VARCHAR(10)         NOT NULL UNIQUE,
    trip_type           trip_type           NOT NULL DEFAULT 'ONE_WAY',
    status              booking_status      NOT NULL DEFAULT 'PENDING',
    total_amount        NUMERIC(15, 2)     NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user      ON bookings (user_id);
CREATE INDEX idx_bookings_reference ON bookings (booking_reference);
CREATE INDEX idx_bookings_status    ON bookings (status);

-- ══════════════════════════════════════════════════════════════════════
-- 8. BOOKING FLIGHT SEGMENTS (supports round-trip via direction)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE booking_flight_segments (
    id                  BIGSERIAL           PRIMARY KEY,
    booking_id          BIGINT              NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    flight_segment_id   BIGINT              NOT NULL REFERENCES flight_segments(id),
    seat_class_id       BIGINT              NOT NULL REFERENCES seat_classes(id),
    direction           segment_direction   NOT NULL DEFAULT 'OUTBOUND',
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bfs_booking    ON booking_flight_segments (booking_id);
CREATE INDEX idx_bfs_segment    ON booking_flight_segments (flight_segment_id);

-- ══════════════════════════════════════════════════════════════════════
-- 9. BOOKING PASSENGERS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE booking_passengers (
    id                  BIGSERIAL       PRIMARY KEY,
    booking_id          BIGINT          NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name           VARCHAR(255)    NOT NULL,
    date_of_birth       DATE            NOT NULL,
    passport_number     VARCHAR(50),
    nationality         VARCHAR(100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_passengers_booking ON booking_passengers (booking_id);

-- ══════════════════════════════════════════════════════════════════════
-- 10. ANCILLARY SERVICES (master catalogue)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE ancillary_services (
    id              BIGSERIAL           PRIMARY KEY,
    name            VARCHAR(255)        NOT NULL,
    type            ancillary_type      NOT NULL,
    description     TEXT,
    price           NUMERIC(15, 2)     NOT NULL,
    is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- 11. BOOKING ANCILLARIES
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE booking_ancillaries (
    id                  BIGSERIAL           PRIMARY KEY,
    booking_id          BIGINT              NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ancillary_service_id BIGINT             NOT NULL REFERENCES ancillary_services(id),
    ancillary_type      ancillary_type      NOT NULL,
    description         VARCHAR(500),
    quantity            INT                 NOT NULL DEFAULT 1,
    unit_price          NUMERIC(15, 2)     NOT NULL,
    total_price         NUMERIC(15, 2)     NOT NULL,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_ancillaries_booking ON booking_ancillaries (booking_id);

-- ══════════════════════════════════════════════════════════════════════
-- 12. PAYMENTS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE payments (
    id                  BIGSERIAL           PRIMARY KEY,
    booking_id          BIGINT              NOT NULL REFERENCES bookings(id),
    amount              NUMERIC(15, 2)     NOT NULL,
    method              payment_method      NOT NULL,
    status              payment_status      NOT NULL DEFAULT 'PENDING',
    transaction_ref     VARCHAR(255),
    paid_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE INDEX idx_payments_status  ON payments (status);

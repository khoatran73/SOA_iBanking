const TuitionStatus = (value: string) => {
    let status = '';
    let color = '';
    switch (value) {
        case 'waiting':
            status = 'Chờ thanh toán';
            color = '#337ab7';
            break;
        case 'paid':
            status = 'Đã thanh toán';
            color = '#5cb85c';
            break;
        case 'expried':
            status = 'Hết hạn';
            color = '#ffc107';
            break;
        default:
            status = 'Chờ thanh toán';
            color = '#337ab7';
            break;
    }
    return (
        <div
            style={{
                fontWeight: 700,
                border: '1px solid',
                borderRadius: '5px',
                minWidth: '80px',
                width: 'fit-content',
                textAlign: 'center',
                lineHeight: '16px',
                padding: '5px 3px',
                color: color,
                margin: '5px auto',
            }}
        >
            <span>{status}</span>
        </div>
    );
};
export default TuitionStatus;

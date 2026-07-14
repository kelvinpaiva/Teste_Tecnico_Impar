namespace CarSalesCrm.Application.Common.Results;

public enum ResultStatus
{
    Success,
    ValidationError,
    NotFound,
    Conflict,
    Failure
}

public class Result
{
    public bool IsSuccess => Status == ResultStatus.Success;
    public ResultStatus Status { get; protected set; }
    public string Message { get; protected set; } = string.Empty;
    public IReadOnlyList<string> Errors { get; protected set; } = Array.Empty<string>();

    public static Result Success(string message = "") =>
        new() { Status = ResultStatus.Success, Message = message };

    public static Result Failure(string message, IEnumerable<string>? errors = null) =>
        new()
        {
            Status = ResultStatus.Failure,
            Message = message,
            Errors = errors?.ToList() ?? new List<string>()
        };

    public static Result NotFound(string message) =>
        new() { Status = ResultStatus.NotFound, Message = message };

    public static Result Conflict(string message) =>
        new() { Status = ResultStatus.Conflict, Message = message };

    public static Result ValidationError(string message, IEnumerable<string>? errors = null) =>
        new()
        {
            Status = ResultStatus.ValidationError,
            Message = message,
            Errors = errors?.ToList() ?? new List<string>()
        };
}

public class Result<T> : Result
{
    public T? Data { get; private set; }

    public static Result<T> Success(T data, string message = "") =>
        new() { Status = ResultStatus.Success, Data = data, Message = message };

    public new static Result<T> Failure(string message, IEnumerable<string>? errors = null) =>
        new()
        {
            Status = ResultStatus.Failure,
            Message = message,
            Errors = errors?.ToList() ?? new List<string>()
        };

    public new static Result<T> NotFound(string message) =>
        new() { Status = ResultStatus.NotFound, Message = message };

    public new static Result<T> Conflict(string message) =>
        new() { Status = ResultStatus.Conflict, Message = message };

    public new static Result<T> ValidationError(string message, IEnumerable<string>? errors = null) =>
        new()
        {
            Status = ResultStatus.ValidationError,
            Message = message,
            Errors = errors?.ToList() ?? new List<string>()
        };
}
